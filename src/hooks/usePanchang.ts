import React, { useState } from "react";
import {
  getCalender,
  getCalenderEventsByType,
  getDakshina,
  getLiveTV,
  getPanchangByDate,
  getRashifalByDate,
} from "../services";

const usePanchang = () => {
  const [panchang, setpanchang] = useState<any>(null);
  const [panchangImages, setpanchangImages] = useState<any[]>([]);
  const [dakshinaImages, setDakshinaImages] = useState<any[]>([]);
  const [liveTV, setliveTV] = useState<string[]>([]);
  const [loading, setloading] = useState(false);
  const getDateWisePanchang = async (date: string) => {
    try {
      setloading(true);
      const response = await getPanchangByDate(date);
      console.log(response?.data?.data);
      setpanchang(response?.data?.data);
    } catch (error) {
      console.error(error);
      setpanchang(null);
    } finally {
      setloading(false);
    }
  };

  const getDateWiseRashifal = async (date: string) => {
    setpanchangImages([]);
    try {
      console.log(date);
      setloading(true);
      const response = await getRashifalByDate(date);
      console.log(response?.data?.data, "get rashifal by date");

      setpanchangImages([response?.data?.data?.image]);
    } catch (error) {
      console.error(error);
      setpanchang(null);
    } finally {
      setloading(false);
    }
  };

  const getCompleteCalender = async () => {
    setpanchangImages([]);
    try {
      setloading(true);
      const response = await getCalender();
      console.log(response?.data?.data, "get calender ");
      const imageUrls: any[] = response.data?.data?.map(
        (item: any) => item?.image
      );
      setpanchangImages(imageUrls);
    } catch (error) {
      console.error(error);
      setpanchang(null);
    } finally {
      setloading(false);
    }
  };

  const getDakshinaAll = async () => {
    try {
      setloading(true);
      const response = await getDakshina();
      console.log(response?.data?.data, "get dakshina ");
      const imageUrls: any[] = response.data?.data?.map(
        (item: any, index: number) => ({
          id: index,
          source: item?.image,
        })
      );
      console.log(imageUrls);
      setDakshinaImages(imageUrls);
    } catch (error) {
      console.error(error);
      setpanchang(null);
    } finally {
      setloading(false);
    }
  };

  const getLiveTvAll = async () => {
    try {
      setloading(true);
      const response = await getLiveTV();
      console.log(response?.data?.data, "get Live TV ");
      const data = response?.data?.data;

      if (Array.isArray(data)) {
        setliveTV(data);
      } else {
        // setliveTV(data?.youtubeLink);
      }
    } catch (error) {
      console.error(error);
      setliveTV([]);
    } finally {
      setloading(false);
    }
  };

  const getCalenderEventsBYType = async (type: string) => {
    try {
      const response = await getCalenderEventsByType(type);
      console.log(response?.data?.data, "get calender events by type");
      setpanchangImages(response?.data?.data[0]?.images);
    } catch (error) {
      console.error(error);
      setpanchangImages([]);
    } finally {
      setloading(false);
    }
  };

  return {
    getDateWisePanchang,
    getDateWiseRashifal,
    getCompleteCalender,
    getDakshinaAll,
    getLiveTvAll,
    dakshinaImages,
    panchang,
    panchangImages,
    liveTV,
    loading,
    setpanchangImages,
    getCalenderEventsBYType,
  };
};

export default usePanchang;
