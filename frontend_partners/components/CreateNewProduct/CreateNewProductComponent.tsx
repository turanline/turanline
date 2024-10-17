"use client";
import React, { CSSProperties, useState, useEffect, useMemo } from "react";
import { Icons } from "../Icons/Icons";
import Link from "next/link";
import Image from "next/image";
import { Dropdown, DropdownTrigger } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import NoPicture from '../../public/assets/other/no_picture_create.png';
import { showToastMessage } from "@/app/toastsChange";
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useTranslate } from "@/hooks/useTranslate";
import { useProductForm } from "@/hooks/useProductForm";
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
//Utils
import { PROVIDER_PRODUCTS_ROUTE, LOGIN_ROUTE } from "@/utils/Consts";
//Services
import { createNewProduct } from "@/services/providerAPI";
//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Zoom from 'react-medium-image-zoom';
//Types
import { Color, ProductFormArguments,GoodInformationCreate } from "@/types/additionalTypes";
//Styles
import "./CreateNewProductComponent.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import 'react-medium-image-zoom/dist/styles.css';
import "swiper/css/thumbs";

const CreateNewProductComponent = () => {
  const translate = useTranslate();

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const [uploadedImageCount, setUploadedImageCount] = useState(0);
  const [goodSizesClothes, setGoodSizesClothes] = useState<{ [key: string]: number }>({XS: 1});
  const [images, setImages] = useState<(string | null)[]>([]);
  const [isActiveFormGood, setIsActiveFormGood] = useState<boolean>(true);
  const [productColors, setProductColors] = useState<Color[]>([]);
  const [disabledButtonSend, setDisabledButtonSend] = useState<boolean>(false);
  const [goodInformation, setGoodInformation] = useState<GoodInformationCreate>({
    name: "", price: '', description: '', article: "", compound: "", season: "Summer", pattern: "", country: {name:"Country",id:1},weight:"",mold:"No-mold",material:"No-material",
  });
  //Arguments
  const productFormArguments: ProductFormArguments<GoodInformationCreate> = {
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
  const { status, isProviderAuth } = useTypedSelector((state) => state.authorization);
  const { selectedLanguage} = useTypedSelector((state) => state.language);
  const { returnInputError, returnInputProperties, isValid } = useCustomForm<any>();
  const { onGetUser } = useUserActions();
  const productForm = useProductForm(productFormArguments);
  const {push} = useRouter();

  const { name, price, description, compound, season, pattern, country,weight,mold,material } = goodInformation;


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
          <button className="delete-button" onClick={() => productForm.handleDeleteImage(index)}>
            <Icons id='deleteCard'/>
          </button>
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
              <button className="delete-button lil" onClick={() => productForm.handleDeleteImage(index)}>
                <Icons id='deletePhotoLil'/>
              </button>
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
        <div className="upload-wrapper">
          <input
            className="addPhotos"
            type="file"
            accept="image/*"
            multiple
            onChange={productForm.handleUpload}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="custom-file-upload">
            {translate.uploadPhoto}
          </label>
          <div className="uploaded-info">
            <p>{translate.photosInfo}: {uploadedImageCount}</p>
          </div>
        </div>
      </div>
    );
  }, [productForm.handleDeleteImage, images, thumbsSwiper, translate]);


  const createProductPost = async () => {
    if (!isValid) {
      showToastMessage("warn", translate.notifyFillFields);
      return;
    }

    try {
      const sizes_data = Object.entries(goodSizesClothes).map(([name, amount]) => ({
        name,
        amount,
      }));
      const newColors = productColors.map(({ slug, amount }) => ({
        slug,
        amount,
      }));


      const productParameters = {
        name, description, compound, colors_data: newColors ,sizes_data: sizes_data,images: images,
        manufacturerCountry: country?.id, amount: 2147483647, price, season, pattern:pattern || 'No', weight: weight,category:productForm?.choosenCategory?.subtype?.id,mold:mold,material
      };

      setDisabledButtonSend(true);

      const response = await createNewProduct(productParameters,selectedLanguage);
      if (response?.status === 201) {
        showToastMessage("success", translate.notifySuccesAddProduct);
        push(PROVIDER_PRODUCTS_ROUTE);
        setDisabledButtonSend(false);
        return;
      }
      showToastMessage("error", translate.notifyUnSuccesAddProduct);
      console.log(response);
      setDisabledButtonSend(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsActiveFormGood(false);
  }, []);

  useEffect(() => {
    onGetUser();
  }, [onGetUser]);

  useEffect(() => {
    if (!isProviderAuth && status === "fulfilled") push(LOGIN_ROUTE);
  }, [isProviderAuth, status, push]);

  if (!isProviderAuth && status === "pending")
    return (
      <div className="products-content_spiner">
        <Icons id="spiner" />
      </div>
    );

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
      <div className="flex flex-col mt-[30px]">
        <div className="product_top">
          <h1 className="text-[32px] font-medium mb-[24px] flex flex-col w-[100%]">
            <input
                  {...returnInputProperties("name")}
                  className='provider-form-input active'
                  value={name}
                  placeholder={translate.productPageTitle}
                  onChange={productForm.changeGoodInformation} 
                  minLength={3}
                />
              {returnInputError("name")}
          </h1>

          <div className="buttons-header-wrapper">
              <button 
                style={{ display: 'block' ,marginLeft:25}}
                onClick={createProductPost}
                disabled={disabledButtonSend}
              >{translate.saveButton}</button>
          </div>
        </div>

        <div className="product-page_wrapper">
          {renderSlider}

          <div className="border-1 border-border shadow-xl product-page_info">
            <div className="product-info-wrapper">

            <div className="product-block-1 flex flex-col">
              <div className="product-info">
                <p className="text-textAcc">{translate.productPageCompound}:</p>
                <input
                  {...returnInputProperties("compound")}
                  className='provider-form-input active'
                  value={compound}
                  placeholder={translate.productPageCompound}
                  onChange={productForm.changeGoodInformation} 
                  minLength={3}
                  maxLength={24}

                />
                {returnInputError("compound")}
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.productPageSeason}:</p>
                <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        className='button-option_left_table active'
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
                  name='pattern'
                  className='provider-form-input active'
                  value={pattern}
                  placeholder={translate.productPagePattern}
                  onChange={productForm.changeGoodInformation} 
                  maxLength={24}
                />
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.productPageCountry}:</p>
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        className='button-option_left_table active'
                      >
                        {country.name}
                        <Icons id='arrowDownProfile'/>
                      </button>
                    </DropdownTrigger>
                  
                    {productForm.renderCountriesToChooseInDropDownMenu()}
                  </Dropdown>
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.headerCategorySelect}:</p>
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        className='button-option_left_table active'
                      >
                        {productForm.choosenCategory.categories || translate.headerCategorySelect}
                        <Icons id='arrowDownProfile'/>
                      </button>
                    </DropdownTrigger>
                  
                    {productForm.renderCategoriesToChooseInDropDownMenu()}
                  </Dropdown>
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.headerTypeSelect}:</p>
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        className='button-option_left_table active'
                      >
                      {productForm.choosenCategory.type || translate.headerTypeSelect}
                        <Icons id='arrowDownProfile'/>
                      </button>
                    </DropdownTrigger>
                  
                    {productForm.renderTypesToChooseInDropDownMenu()}
                  </Dropdown>
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.headerSubtypeSelect}:</p>
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        className='button-option_left_table active'
                      >
                        {productForm.choosenCategory.subtype.slug || translate.headerSubtypeSelect}

                        <Icons id='arrowDownProfile'/>
                      </button>
                    </DropdownTrigger>
                  
                    {productForm.renderSubtypesToChooseInDropDownMenu()}
                  </Dropdown>
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.productWeight}:</p>
                <input
                  {...returnInputProperties("weight")}
                  className='provider-form-input active'
                  value={weight}
                  onChange={productForm.changeGoodInformation} 
                  minLength={1}
                  maxLength={6}
                  placeholder="100.00"
                />
                {returnInputError("weight")}
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.moldTitle}:</p>
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        className='button-option_left_table active'
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
                        className='button-option_left_table active'
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
              <p className="text-textAcc">{translate.productsPagePrice} - $:</p>

              <input
                  {...returnInputProperties("price")}
                  className='provider-form-input card-price active'
                  value={price}
                  onChange={productForm.changeGoodInformation} 
                  minLength={4}
                  maxLength={11}
                  placeholder='100.00 $'
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
                          style={{display:"block"}}
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
          <p className="text-[24px] family-medium">{translate.productPageDescription}:</p>
          <input
            {...returnInputProperties("description")}
            className='provider-form-input description active'
            value={description}
            placeholder={translate.productPageDescription}
            onChange={productForm.changeGoodInformation}
            minLength={3}
          />
        {returnInputError("description")}
        </div>
   </div>
 </main>
  );
};

export default CreateNewProductComponent;
