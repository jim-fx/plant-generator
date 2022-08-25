import { getReports } from '@plantarium/client-api';

export async function load() {
  const reportResponse = await getReports();
  if (reportResponse.ok) {
    return reportResponse.data;
  }

  return [];
}
