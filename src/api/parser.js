import axios from 'axios';

/**
 * Prometheus 텍스트 데이터에서 한 줄의 라벨 문자열을 {키: 값} 객체로 변환합니다.
 * @param {string} labelString - 중괄호 안의 라벨 문자열 (예: 'area="heap",id="Eden Space"')
 * @returns {Object} - 변환된 라벨 객체 (예: { area: 'heap', id: 'Eden Space' })
 */
const parseLabelsFromString = (labelString) => {
  if (!labelString) return {};
  const labels = {};
  const labelRegex = /([^=,]+)="([^"]*)"/g;
  let match;
  while ((match = labelRegex.exec(labelString)) !== null) {
    labels[match[1].trim()] = match[2];
  }
  return labels;
};

/**
 * Exporter가 반환한 전체 텍스트에서 원하는 메트릭 값들을 찾아 합산합니다.
 * @param {string} text - Exporter가 반환한 전체 텍스트
 * @param {string} metricName - 찾고자 하는 메트릭 이름
 * @param {Object} labelFilters - 필터링할 라벨 조건 (예: { area: 'heap' })
 * @returns {number | null} - 합산된 값 또는 null
 */
const parseAndSum = (text, metricName, labelFilters = {}) => {
  const lines = text.split('\n');
  let totalValue = 0;
  let metricFound = false;

  for (const line of lines) {
    if (line.startsWith('#') || !line.trim().startsWith(metricName)) {
      continue;
    }

    const valueIndex = line.lastIndexOf(' ');
    const metricPart = line.substring(0, valueIndex);
    const value = parseFloat(line.substring(valueIndex + 1));

    if (isNaN(value)) continue;

    const labelsMatch = metricPart.match(/\{(.*)\}/);
    const lineLabels = labelsMatch ? parseLabelsFromString(labelsMatch[1]) : {};

    let allFiltersMatch = true;
    for (const key in labelFilters) {
      const filterValue = labelFilters[key];
      // http status '5xx' 같은 케이스를 위한 'startsWith' 필터링
      if (typeof filterValue === 'string' && filterValue.startsWith('~')) {
        if (!lineLabels[key] || !lineLabels[key].startsWith(filterValue.substring(1))) {
          allFiltersMatch = false;
          break;
        }
      } else { // 정확한 값 일치 필터링
        if (lineLabels[key] !== filterValue) {
          allFiltersMatch = false;
          break;
        }
      }
    }

    if (allFiltersMatch) {
      totalValue += value;
      metricFound = true;
    }
  }

  return metricFound ? totalValue : null;
};


/**
 * Exporter URL에서 데이터를 가져와 파싱하는 최종 함수
 * @param {string} url - Exporter URL
 * @param {string} metricName - 메트릭 이름
 * @param {Object} labelFilters - 라벨 필터
 * @returns {Promise<number | null>}
 */
export const fetchAndParse = async (url, metricName, labelFilters) => {
  try {
    const response = await axios.get(url);
    var result = parseAndSum(response.data, metricName, labelFilters);
    console.log(result);
    return result;
  } catch (error) {
    console.error(`[${metricName}] 데이터 가져오기 실패:`, error.message);
    return null;
  }
};