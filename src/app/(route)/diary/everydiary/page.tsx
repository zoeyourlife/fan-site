"use client";

import useDiaryStore from "@/store/diaryStore";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import EditIcon from "@mui/icons-material/Edit";
import useAuthStore from "@/store/authStore";

function EveryDiary() {
  const diaryList = useDiaryStore((state) => state.diaryList);
  const page = useDiaryStore((state) => state.page);
  const hasMore = useDiaryStore((state) => state.hasMore);
  const getDiaryList = useDiaryStore((state) => state.getDiaryList);
  const isLoading = useDiaryStore((state) => state.isLoading);

  const roles = useAuthStore((state) => state.roles);
  const router = useRouter();

  useEffect(() => {
    if (diaryList.length === 0 && !isLoading) {
      // 데이터가 없고 로딩 중이 아닐 때만 요청
      getDiaryList(page);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diaryList.length, page, isLoading, getDiaryList]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      hasMore &&
      !isLoading
    ) {
      const currentPage = useDiaryStore.getState().page;
      getDiaryList(currentPage);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading]);

  const handleCardClick = (id: number | undefined) => {
    if (id !== undefined) {
      router.push(`/diary/${id}`);
    } else {
      console.error("Invalid diary id");
    }
  };

  const handleWriteClick = () => {
    router.push("/diary/write");
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          position: "relative",
          padding: { xs: 2, sm: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 글쓰기 버튼 */}
        {roles && roles.includes("ROLE_ARTIST") ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: 4,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleWriteClick}
              sx={{
                backgroundColor: "#FCC422",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "#F2A800",
                },
              }}
            >
              글쓰기
            </Button>
          </Box>
        ) : (
          <Box></Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {diaryList.map((diary, index) => (
            <Box
              key={`${diary.id}-${index}`}
              sx={{
                width: { xs: "100%", sm: "48%", md: "30%" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
                onClick={() => handleCardClick(diary.id)}
              >
                <CardMedia
                  component="img"
                  height="250"
                  image={
                    diary.articleImageList[0]?.url
                      ? `/api/${diary.articleImageList[0].url}`
                      : "/images/diary1.png"
                  }
                  alt={diary.title}
                  sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold", color: "text.primary" }}
                  >
                    {diary.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {diary.createDate}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: 1 }}
                  >
                    {diary.content.length > 50
                      ? `${diary.content.slice(0, 50)}...`
                      : diary.content}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default EveryDiary;
