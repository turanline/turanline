"use client";
import React, { CSSProperties,useState, useEffect, useCallback,useRef, useMemo} from "react";
import { Icons } from '../Icons/Icons';
import Link from "next/link";
import Image from "next/image";
import { Dropdown, DropdownTrigger } from "@nextui-org/react";
import { putProductBySlug } from "@/services/providerAPI";
import { showToastMessage } from "@/app/toastsChange";
import NoPicture from "../../public/assets/other/no_picture_create.png";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useUserActions } from "@/hooks/useUserActions";
import { useTranslate } from "@/hooks/useTranslate";
import { useProductForm } from "@/hooks/useProductForm";
import { useRouter } from "next/navigation";
//Utils
import { PROVIDER_PRODUCTS_ROUTE } from "@/utils/Consts";
//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Zoom from 'react-medium-image-zoom';
//Types
import {
  Color,
  GoodInformationEdit,
  IProductEditPage,
  ProductFormArguments,
} from "@/types/additionalTypes";
//Styles
import "./EditDynamicCard.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import 'react-medium-image-zoom/dist/styles.css';

export const EditDynamicCard = ({oneProduct,language,}: {oneProduct: IProductEditPage; language: string;}) => {
  const allImagesBase64 = useMemo(() => oneProduct?.images?.map((image) => image?.image_file),[oneProduct]);

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [goodInformation, setGoodInformation] = useState<GoodInformationEdit>({
    name: "", price: '', description: '', article: "", compound: "", brand: "", season: "", pattern: "", country: {name:"",id: 0},weight:"",mold:"",category:"",material:""
  });
  const [uploadedImageCount, setUploadedImageCount] = useState(0);
  const [goodSizesClothes, setGoodSizesClothes] = useState<{ [key: string]: number }>({});
  const [images, setImages] = useState<(string | null)[]>([...allImagesBase64]);
  const [isActiveFormGood, setIsActiveFormGood] = useState<boolean>(true);
  const [productColors,setProductColors] = useState<Color[]>([]);
  const [disabledButtonSend,setDisabledButtonSend] = useState<boolean>(false);
  const { name, price, description, article, compound, brand, season, pattern, country,weight,mold ,material} = goodInformation;
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const {push} = useRouter();

  const checkUsdValue = useMemo(() => `${price}${isActiveFormGood ? ' $ ' : ''}`, [price, isActiveFormGood]);
  //classNames
  const activeButtonsClassName = useMemo(() => ({ display: isActiveFormGood ? 'none' : 'block' }), [isActiveFormGood]);
  const activeLeftTableClassName = useMemo(() => `button-option_left_table ${isActiveFormGood ? '' : 'active'}`, [isActiveFormGood]);
  const inputClassName = useMemo(() => `provider-form-input ${isActiveFormGood ? '' : 'active'}`, [isActiveFormGood]);
  const inputClassNamePrice = useMemo(() => `provider-form-input card-price ${isActiveFormGood ? '' : 'active'}`, [isActiveFormGood]);
  const inputClassNameDescription = useMemo(() => `provider-form-input description ${isActiveFormGood ? '' : 'active'}`, [isActiveFormGood]);
  //Arguments
  const productFormArguments: ProductFormArguments<GoodInformationEdit> = {
    images,
    setImages,
    isActiveFormGood,
    uploadedImageCount,
    setUploadedImageCount,
    goodSizesClothes,
    setGoodSizesClothes,
    productColors,
    setProductColors,
    goodInformation,
    setGoodInformation,
  };

  //Hooks
  const {returnInputError, returnInputProperties } = useCustomForm<any>();
  const productForm = useProductForm(productFormArguments);
  const { onGetColors } = useUserActions();
  const translate = useTranslate();


   const setActiveForm = useCallback(() => setIsActiveFormGood(prev => !prev), []);

  //send to server
  const sendNewChanges = useCallback(async () => {
    try {
      const sizes_data = Object.entries(goodSizesClothes)?.map(([name, amount]) => ({
        name,
        amount,
      }));
      const newColors = productColors?.map(({ slug, amount }) => ({ slug, amount }));

      const changes = {
        name, description, compound, colors_data: newColors ,sizes_data: sizes_data,images: images,status:'A',
        manufacturerCountry: country?.id, amount: 2147483647, price, season, pattern, weight: weight,mold:mold,material
      };
      setDisabledButtonSend(true);
      
      const response = await putProductBySlug(oneProduct?.article_number, changes,language);
        if(response?.status === 200){
          showToastMessage('success', translate.notifySuccessChangedProduct);
          setDisabledButtonSend(false);
          push(PROVIDER_PRODUCTS_ROUTE );
          setActiveForm();
        } else {
          setDisabledButtonSend(false);
          showToastMessage('error', translate.notifyErrorChangedProduct);
        }
    } catch (error) {
      showToastMessage("error", translate.notifyErrorChangedProduct);
      console.error(error);
    }

  }, [goodInformation,images,productColors,goodSizesClothes]);
  //RENDER-MAP FUNCTIONS

  const renderSlider = useMemo(() => {
    const styles: CSSProperties & { [key: string]: string } = {
      "--swiper-navigation-color": "#fff",
      "--swiper-pagination-color": "#fff",
    };

    const renderSlides = () => {
      if (!images?.length)
        return (
          <SwiperSlide>
            <Image
              src={NoPicture}
              alt={'carousel-images'}
              width={400}
              height={400}
              className="swiper-slides-photos"
            />
          </SwiperSlide>
        );

      return images?.map((image, index) => (
        <SwiperSlide key={index}>
          <Zoom>
            <Image
              src={image || NoPicture}
              alt={'carousel-images'}
              width={400}
              height={400}
              className="swiper-slides-photos"
            />
          </Zoom>
          {!isActiveFormGood && (
                <button className="delete-button" onClick={() => productForm.handleDeleteImage(index)}>
                  <Icons id='deleteCard'/>
                </button>
              )}
        </SwiperSlide>
      ));
    };

    const renderLilSlides = () => {
      if (!images?.length) return;

      return (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
        >
          {images?.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={image || NoPicture}
                alt={'carousel-images-lil'}
                width={90}
                height={90}
                className="swiper-slides-photos lil"
              />
              {!isActiveFormGood && (
                <button className="delete-button lil" onClick={() => productForm.handleDeleteImage(index)}>
                  <Icons id='deletePhotoLil'/>
                </button>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    return (
      <div className="slider-wrapper">
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2"
          wrapperClass="margin-0"
          style={styles}
        >
          {renderSlides()}
        </Swiper>

        {renderLilSlides()}
        {!isActiveFormGood && (
          <div className="upload-wrapper">
          <input
            className="addPhotos"
            type="file"
            multiple
            onChange={productForm.handleUpload}
            id="file-upload"
            accept="image/*"
          />
          <label htmlFor="file-upload" className="custom-file-upload">
            {translate.uploadPhoto}
          </label>
          <div className="uploaded-info">
            <p>{translate.photosInfo}: {uploadedImageCount}</p>
          </div>
        </div>
        )}
      </div>
    );
  }, [productForm.handleDeleteImage, images, isActiveFormGood, oneProduct?.name, thumbsSwiper]);

  useEffect(() => {
    setGoodInformation({
      name: oneProduct?.name,
      price: oneProduct?.price,
      description: oneProduct?.description,
      article: oneProduct?.article_number,
      compound: oneProduct?.compound,
      brand: oneProduct?.provider?.company,
      season: oneProduct?.season,
      pattern: oneProduct?.pattern,
      country: {
        name:oneProduct?.manufacturerCountry?.name,
        id:oneProduct?.manufacturerCountry?.id,
      },
      weight: oneProduct?.weight,
      mold: oneProduct?.mold,
      category: oneProduct?.category?.name,
      material: oneProduct?.material
    });

    const sizes = oneProduct?.sizes_data?.reduce((acc, { name, amount }) => {
      acc[name] = amount || 0;
      return acc;
    }, {} as { [key: string]: number });

    setProductColors(oneProduct?.colors_data);
    setGoodSizesClothes(sizes);
    setUploadedImageCount(images?.length);
  }, [language]);

  useEffect(() => {
    onGetColors();
  }, [onGetColors]);


  return (
    <main>
    <nav className="products-product-content_link-block">
       <Link
         className="products-product-content_link"
         href={PROVIDER_PRODUCTS_ROUTE}
       >
         {translate.back} <Icons id='arrowBlack'/>
       </Link>
     </nav>
   <div key={oneProduct?.id} className="flex flex-col mt-[30px]">
     <div className="product_top">
       
       <h1 className="text-[32px] font-medium mb-[24px] flex flex-col w-[100%]">
         <input
               {...returnInputProperties("name")}
               disabled={isActiveFormGood}
               className={inputClassName}
               value={name}
               onChange={productForm.changeGoodInformation} 
               readOnly={isActiveFormGood}
               minLength={3}
             />
          {returnInputError("name")}
       </h1>

       <div className="buttons-header-wrapper">
          <button 
             style={activeButtonsClassName}
             onClick={sendNewChanges}
             disabled={disabledButtonSend}
           >{translate.saveButton}</button>
          <button onClick={setActiveForm}><Icons id='pencil'/></button>
       </div>
     </div>

     <div className="product-page_wrapper">
       {renderSlider}

       <div className="border-1 border-border shadow-xl product-page_info">
         <div className="product-info-wrapper">

         <div className="product-block-1 flex flex-col">
           <div className="product-info">
             <p className="text-textAcc">{translate.productsPageArticle}:</p>
             <input
               {...returnInputProperties("article")}
               className='provider-form-input'
               value={article}
               onChange={productForm.changeGoodInformation} 
               readOnly={true}
               minLength={3}
               maxLength={24}
               disabled={true}
             />
             {returnInputError("article")}
           </div>
           <div className="product-info">
             <p className="text-textAcc">{translate.productPageCompound}:</p>
             <input
               {...returnInputProperties("compound")}
               className={inputClassName}
               value={compound}
               onChange={productForm.changeGoodInformation} 
               readOnly={isActiveFormGood}
               minLength={3}
               maxLength={24}
               disabled={isActiveFormGood}
             />
             {returnInputError("compound")}
           </div>
           <div className="product-info">
             <p className="text-textAcc">{translate.productPageManufacturer}:</p>
             <input
               {...returnInputProperties("brand")}
               className='provider-form-input'
               value={brand}
               onChange={productForm.changeGoodInformation} 
               readOnly={true}
               minLength={3}
               maxLength={24}
               disabled={true}
             />
             {returnInputError("brand")}
           </div>
           <div className="product-info">
             <p className="text-textAcc">{translate.productPageSeason}:</p>
             <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                 <DropdownTrigger>
                   <button
                     disabled={isActiveFormGood}
                     className={activeLeftTableClassName}
                   >
                     {season}
                     <Icons id='arrowDownProfile'/>
                   </button>
                 </DropdownTrigger>
               
                 {productForm.renderSeasonsToChooseInDropDownMenu()}
               </Dropdown>
           </div>
           <div className="product-info">
             <p className="text-textAcc">{translate.productPagePattern}:</p>
             <input
               {...returnInputProperties("pattern")}
               className={inputClassName}
               value={pattern}
               onChange={productForm.changeGoodInformation} 
               readOnly={isActiveFormGood}
               disabled={isActiveFormGood}
             />
           </div>
           <div className="product-info">
             <p className="text-textAcc">{translate.productPageCountry}:</p>
               <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                 <DropdownTrigger>
                   <button
                     disabled={isActiveFormGood}
                     className={activeLeftTableClassName}
                   >
                     {country?.name}
                     <Icons id='arrowDownProfile'/>
                   </button>
                 </DropdownTrigger>
               
                 {productForm.renderCountriesToChooseInDropDownMenu()}
               </Dropdown>
           </div>
           <div className="product-info">
                <p className="text-textAcc">{translate.headerCategorySelect}:</p>
                <p className="provider-form-input">{goodInformation?.category || translate.headerCategorySelect}</p>
          </div>
           <div className="product-info">
             <p className="text-textAcc">{translate.productWeight}:</p>
             <input
               {...returnInputProperties("weight")}
               className={inputClassName}
               value={weight}
               onChange={productForm.changeGoodInformation} 
               readOnly={isActiveFormGood}
               minLength={1}
               maxLength={6}
               disabled={isActiveFormGood}
             />
             {returnInputError("weight")}
           </div>
           <div className="product-info">
                <p className="text-textAcc">{translate.moldTitle}:</p>
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        disabled={isActiveFormGood}
                        className={activeLeftTableClassName}
                      >
                        {mold}
                        <Icons id='arrowDownProfile'/>
                      </button>
                    </DropdownTrigger>
                  
                    {productForm.renderMoldsToChooseInDropDownMenu()}
                  </Dropdown>
          </div>
          <div className="product-info">
                <p className="text-textAcc">{translate.materialTitle}:</p>
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        disabled={isActiveFormGood}
                        className={activeLeftTableClassName}
                      >
                        {material}
                        <Icons id='arrowDownProfile'/>
                      </button>
                    </DropdownTrigger>
                  
                    {productForm.renderMaterialToChooseInDropDownMenu()}
                  </Dropdown>
          </div>
         </div>

         <div className="product-block-2 flex flex-col gap-[15px]">
           <div className="sizes-table">
             <p>{translate.sizes}:</p>
              {productForm.renderSizes()}
           </div>
           <div className="colors-table">
             <p>{translate.kits}:</p>
             {productForm.renderColorsTable()}
           </div>
         </div>

           <div className="right-wrapper_color_sizes">

           <input
               {...returnInputProperties("price")}
               className={inputClassNamePrice}
               value={checkUsdValue}
               onChange={productForm.changeGoodInformation} 
               readOnly={isActiveFormGood}
               minLength={3}
               disabled={isActiveFormGood}
               maxLength={11}
             />
             {returnInputError("price")}
             
             <p className="text-textAcc">{translate.productPageInStock}:</p>

             <div className="renderSizes">
                  {productForm.renderSizesButton()}

                  {productForm.renderClothesSizesInModal()}
              </div>

             <div className="renderColors">
               {productForm.mapProductColors()}
               <Dropdown classNames={{content:'Dropdown-wrapper-color'}}>
                 <DropdownTrigger>
                   <button
                       style={isActiveFormGood ? {display:'none'} : {display:"block"}}
                       className="button-option_color add"
                     >
                       +
                   </button>
                 </DropdownTrigger>
               
                 {productForm.renderColorsToChooseInDropDownMenu()}

               </Dropdown>
             </div>
           </div>
         </div>

      
       </div>
     </div>

      <div className="product-page_description">
        <p className="text-[24px] family-medium">
          {translate.productPageDescription}:
        </p>
        <input
          {...returnInputProperties("description")}
          placeholder={translate.productPageDescription}
          className={inputClassNameDescription}
          value={description}
          onChange={productForm.changeGoodInformation}
          disabled={isActiveFormGood}
          minLength={3}
        />
        {returnInputError("description")}
    </div>
    </div>
  </main>
)};
