import { useState, useEffect } from 'react';

// 定数URLの管理
const WEATHER_API_URL = "https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json";

// エラーハンドリングの共通関数
const handleError = (error) => {
  console.error("Error:", error);
  return 'データの取得に失敗しました';
};

// データ取得の非同期関数
const fetchWeatherData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
};

const WeatherComponent = () => {
  const [data, setData] = useState({ weatherData: null, error: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await fetchWeatherData(WEATHER_API_URL);
        setData({ weatherData, error: null });
      } catch (error) {
        setData({ weatherData: null, error: handleError(error) });
      }
    };
    fetchData();
  }, []);

  // 東京地方の天気と風速を抽出
  const extractTokyoWeather = (weatherData) => {
    if (!weatherData || !weatherData[0]?.timeSeries?.length) {
      return { weather: 'データがありません', wind: 'データがありません' };
    }

    // 時間帯別の天気情報
    const weatherInfo = weatherData[0].timeSeries.find(ts => ts.areas);
    const tokyoWeather = weatherInfo?.areas?.find(area => area.area?.name === "東京地方");
    
    // 時間帯別の風速情報
    const windInfo = weatherData[1]?.timeSeries?.find(ts => ts.areas);
    const tokyoWind = windInfo?.areas?.find(area => area.area?.name === "東京地方");
    
    return {
      weather: tokyoWeather?.weathers ? tokyoWeather.weathers[0] : '不明',
      wind: tokyoWind?.winds ? tokyoWind.winds[0] : '不明'
    };
  };

  const { weatherData, error } = data;
  const tokyoWeatherData = weatherData ? extractTokyoWeather(weatherData) : null;

  return (
    <div>
      <h1>東京地方の天気</h1>
      {error ? (
        <p>{error}</p>
      ) : tokyoWeatherData ? (
        <div>
          <p>天気: {tokyoWeatherData.weather}</p>
          <p>風速: {tokyoWeatherData.wind}</p>
        </div>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
};

export default WeatherComponent;
