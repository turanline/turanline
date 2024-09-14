"use server";

import { cookies } from "next/headers";
import setCookie from "set-cookie-parser";

export async function postChannel(prevState: any, formData: FormData) {
  "use server";

  const req = await fetch(`${process.env.BASE_URL}/get_csrf_tokens`);
  const res_signed_token = req.headers.getSetCookie();
  const { csrf_token } = await req.json();
  const cookieObj = setCookie.parse(res_signed_token);
  cookieObj.map((cookie) => {
    cookies().set(cookie.name, cookie.value, {
      httpOnly: true,
      path: "/",
      maxAge: 600,
    });
  });
  const getToken = cookieObj
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join(";");

  const link = formData.get("link");
  const category = formData.get("category");

  const post = await fetch(
    `${process.env.BASE_URL}/request_to_add?type=Канал&link=${link}&category=${category}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: getToken,
        accept: "application/json",
      },
      body: JSON.stringify({ csrf_token }),
    }
  );
  if (!post.ok) {
    const { detail } = await post.json();
    return {
      message: detail,
      status: post.status,
    };
  }
  const { detail } = await post.json();

  return {
    message: detail,
    status: post.status,
  };
}

export async function postBots(prevState: any, formData: FormData) {
  "use server";

  const req = await fetch(`${process.env.BASE_URL}/get_csrf_tokens`);
  const res_signed_token = req.headers.getSetCookie();
  const { csrf_token } = await req.json();
  const cookieObj = setCookie.parse(res_signed_token);
  cookieObj.map((cookie) => {
    cookies().set(cookie.name, cookie.value, {
      httpOnly: true,
      path: "/",
      maxAge: 600,
    });
  });
  const getToken = cookieObj
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`;
    })
    .join(";");

  const link = formData.get("link");

  const post = await fetch(
    `${process.env.BASE_URL}/request_to_add?type=Чат/Бот&link=${link}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: getToken,
        accept: "application/json",
      },
      body: JSON.stringify({ csrf_token }),
    }
  );

  if (!post.ok) {
    const { detail } = await post.json();
    return {
      message: detail,
      status: post.status,
    };
  }
  const { detail } = await post.json();

  return {
    message: detail,
    status: post.status,
  };
}

export async function getChannelsList(page: number) {
  try {
    const res = await fetch(`${process.env.BASE_URL}/channels?page=${page}&limit=31`);

    if (!res?.ok) {
      throw new Error("Failed to fetch data");
    }
    
    return res.json();
  } catch(error) {
    console.log(error)
  }
}

export async function getData() {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/channels?page=0&limit=31`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch(error) {
    console.log(error);
  }

  return []
}

export async function getRec() {
  try {
    const res = await fetch(`${process.env.BASE_URL}/articles/recommended`);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  } catch(error) {
    console.log(error);
  }

  return []
}