"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { API_BASED_URL } from "@/constants/apiUrl";
import Link from "next/link";
import Image from "next/image";

interface GoodsImage {
  id: number;
  url: string;
}

interface Goods {
  id: number;
  goodsName: string;
  price: number;
  goodsImages: GoodsImage[];
}

type GoodsList = Goods[];

function GoodsListPage() {
  const [goodsList, setGoodsList] = useState<GoodsList | null>(null);
  const [sort, setSort] = useState<"last" | "asc" | "desc">("last");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const size = 8;
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const sortData = [
    { label: "최신등록순", value: "last" },
    { label: "낮은가격순", value: "asc" },
    { label: "높은가격순", value: "desc" },
  ];

  const getGoodsList = () => {
    api
      .get(`/goods/list`, {
        params: {
          sort,
          name: searchTerm,
          page: currentPage,
          size,
        },
      })
      .then((response) => {
        setGoodsList(response.data.content);
        console.log(response);
        setTotalPages(response.data.totalPages);
      });
  };

  useEffect(() => {
    getGoodsList();
  }, [currentPage, sort, searchTerm, size]);

  const SearchHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(0);
    getGoodsList();
  };

  return (
    <Box sx={{ pl: 4, pr: 4, pb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box>
            <Paper
              component="form"
              sx={{
                p: "8px 16px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 500,
                borderRadius: "25px",
                boxShadow: 1,
              }}
              onSubmit={SearchHandler}
            >
              <InputBase
                sx={{
                  ml: 1,
                  flex: 1,
                  fontSize: "16px",
                  color: "#333",
                }}
                inputProps={{ "aria-label": "search google maps" }}
                type="text"
                value={searchTerm}
                placeholder="원하는 굿즈를 검색하세요"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.currentTarget.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter")
                    SearchHandler(
                      e as unknown as React.FormEvent<HTMLFormElement>
                    );
                }}
              />
              <IconButton aria-label="search" sx={{ p: 1 }}>
                <SearchIcon sx={{ color: "black" }} />
              </IconButton>
            </Paper>
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
            <ButtonGroup variant="text" aria-label="sort button group">
              {sortData.map((button) => (
                <Button
                  key={button.value}
                  onClick={() =>
                    setSort(button.value as "last" | "asc" | "desc")
                  }
                  sx={{
                    borderColor:
                      sort === button.value ? "black" : "transparent",
                    color: sort === button.value ? "black" : "gray",
                  }}
                  startIcon={sort === button.value ? <CheckIcon /> : null}
                >
                  {button.label}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {goodsList?.map((goods) => (
          <Grid item xs={12} sm={6} md={3} key={goods.id}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 2,
                overflow: "hidden",
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 4,
                },
              }}
            >
              {goods.goodsImages.length > 0 && (
                <Link href={`/goods/${goods.id}`}>
                  <Box
                    key={goods.goodsImages[0].id}
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 300,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={API_BASED_URL + goods.goodsImages[0].url}
                      alt={`굿즈 ${goods.id}`}
                      layout="fill"
                      objectFit="cover"
                      priority
                    />
                  </Box>
                </Link>
              )}
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                  {goods.goodsName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#757575", fontSize: "16px" }}
                >
                  ₩{goods.price.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <IconButton
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="body2" sx={{ alignSelf: "center" }}>
          {currentPage + 1} / {totalPages}
        </Typography>
        <IconButton
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default GoodsListPage;
