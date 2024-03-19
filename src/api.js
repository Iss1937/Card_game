const host = "https://wedev-api.sky.pro/api/leaderboard";

export async function getLeaders() {
  try {
    const response = await fetch(host);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No authorization");
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    const data = await response.json();
    return data.leaders;
  } catch (error) {
    console.warn(error);
    throw error;
  }
}

export async function addLeader({ name, time }) {
  const response = await fetch(host, {
    method: "POST",
    body: JSON.stringify({ name, time }),
  });
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Не удалось загрузить список лидеров, попробуйте снова");
  }
}
