//* 인증 관련 유틸 함수 관리
import useAuthStore from "@/store/authStore";
import { User } from "@/types/iadmin";
import api from "@/utils/api";
import { AxiosError } from "axios";

// 로그인 처리 함수 //!에러 처리 필요
export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/login", { username, password });

    if (response.data.accessToken) {
      useAuthStore.setState({
        username: response.data.username,
        accessToken: response.data.accessToken,
        userNickname: response.data.nickname,
        roles: response.data.roles,
      });
      console.log("로그인 후 상태:", useAuthStore.getState());

      return { success: true, message: "로그인 성공" };
    } else {
      return { success: false, message: "로그인 실패" };
    }
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 488) {
      return { success: false, message: "이메일 인증이 완료되지 않았습니다." };
    }
    return { success: false, message: "로그인 요청 실패" };
  }
};

// 회원가입 처리 함수 //!에러 처리 필요
export const join = async ({
  username,
  password,
  nickname,
}: {
  username: string;
  password: string;
  nickname: string;
}) => {
  try {
    const response = await api.post("/member/join", {
      username,
      password,
      nickname,
    });
    if (response.data) {
      return { success: true, message: "회원가입 성공" };
    } else {
      return { success: false, message: "회원가입 실패" };
    }
  } catch (error) {
    console.error("회원가입 에러: ", error);
  }
};

export const logout = () => {
  useAuthStore.getState().logout();
  alert("로그아웃 완료");
};

// 회원 정보 all get 요청!
export const getUserInfo = async (): Promise<User[]> => {
  try {
    const response = await api.get("/admin/userlist");
    console.log("유저 정보", response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 현재 로그인한 회원 정보 get 요청!
export const getUser = () => {
  try {
    const response = api.get("/home");
    return response;
  } catch (error) {
    console.error("회원정보를 가지고 오는데 실패했습니다!", error);
  }
};
