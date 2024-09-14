import dynamic from "next/dynamic";
import { getData } from "@/app/actions";
const SwiperNewComponent = dynamic(() => import("../SwiperNewComponent/SwiperNewComponent"));



export default async function NewChannels() {
  
  const data = await getData();
  
  return (
    <SwiperNewComponent count={5} data={data} />
  );
}
