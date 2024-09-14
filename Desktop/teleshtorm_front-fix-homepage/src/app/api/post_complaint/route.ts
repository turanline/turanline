import { cookies } from "next/headers";
import { NextRequest } from "next/server"
import setCookie from "set-cookie-parser";


export async function POST(req: NextRequest) {
  
  const formData = await req.formData();
  const getCookie = await fetch(`${process.env.BASE_URL}/get_csrf_tokens`);
  const res_signed_token = getCookie.headers.getSetCookie();
  const { csrf_token } = await getCookie.json();
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
    
  const id = formData.get("id");
  const type = formData.get("type");
  const link_not_work = !!formData.get("link_not_work");
  const drugs = !!formData.get("drugs");
  const false_information = !!formData.get("false_information");
  const child_abuse = !!formData.get("child_abuse");


  const post = await fetch(
    `${
      process.env.BASE_URL
    }/complaint?object_id=${id}&type=${type}&link_not_work=${link_not_work}&drugs=${drugs}&false_information=${false_information}&child_abuse=${child_abuse}`,
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
    return new Response(JSON.stringify({ message: detail, status: post.status }));
  }

  const { detail } = await post.json();
  
  return new Response(JSON.stringify({ message: detail, status: post.status }));;
}