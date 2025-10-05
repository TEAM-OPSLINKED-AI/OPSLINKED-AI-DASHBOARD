import axios from 'axios';

// .env.local 파일에서 환경 변수 가져오기
const API_KEY = import.meta.env.VITE_GRAFANA_API_KEY;
const DATASOURCE_UID = import.meta.env.VITE_GRAFANA_DATASOURCE_ID; // UID 또는 ID

// Grafana의 데이터 소스 프록시 API 엔드포인트
const API_ENDPOINT = `/api/grafana/api/datasources/proxy/uid/${DATASOURCE_UID}/api/v1/query`;

// 인증 헤더를 포함한 Axios 인스턴스
const apiClient = axios.create({
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Grafana를 통해 PromQL 쿼리를 실행하는 함수
 * @param {string} query - 실행할 PromQL 쿼리
 * @returns {Promise<any>} - Prometheus API 응답 데이터
 */
export const fetchMetricsFromGrafana = async (query) => {
  try {
    const response = await apiClient.get(API_ENDPOINT, {
      params: { query },
    });

    if (response.data?.data?.result?.length > 0) {
        console.log(response.data.data.result);
      return response.data.data.result;
    }
    return []; // 데이터가 없을 경우 빈 배열 반환
  } catch (error) {
    console.error(`Error fetching metrics for query: ${query}`, error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};