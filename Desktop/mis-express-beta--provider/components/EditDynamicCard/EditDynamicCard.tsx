"use client";
import React, { CSSProperties,useState, useEffect, useCallback, useMemo} from "react";
import { Icons } from '../Icons/Icons';
import Link from "next/link";
import Image from "next/image";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { putProductBySlug } from "@/services/providerAPI";
import { showToastMessage } from "@/app/toastsChange";
import skeleton from '../../public/assets/other/skeletonEditDynamicPage.gif'
//Hooks
import { useCustomForm } from "@/hooks/useCustomForm.";
import { useUserActions } from "@/hooks/useUserActions";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { useTranslate } from "@/hooks/useTranslate";
//Utils
import { PROVIDER_PRODUCTS_ROUTE } from "@/utils/Consts";
import { convertToBase64 } from "@/utils/Functions";
//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
//Types
import { Color, IProductEditPage } from "@/types/additionalTypes";
//Styles
import "./EditDynamicCard.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

const sizesArray = [
  {  size: "XS" },
  {  size: "S" },
  {  size: "M" },
  {  size: "L" },
  {  size: "XL" },
  {  size: "2XL" },
  {  size: "3XL" },
  {  size: "4XL" },
  {  size: "5XL" },
  {  size: "6XL" },
];

export const EditDynamicCard = ({oneProduct,language}: {oneProduct: IProductEditPage,language: string}) => {
  
  const allImagesBase64 = useMemo(() => oneProduct?.images?.map(image => image?.image_file), [oneProduct]);
  const {onGetColors} = useUserActions();
  const {colors} = useTypedSelector(state => state.user);
  const translate = useTranslate();

  const manufacturiesCountries = [
    {
        name:translate.Russia,
        value:'russia'
    },
    {
        name:translate.China,
        value:'china',
    },
    {
        name:translate.Turkey,
        value:'turkey',
    },
  ];
  const clothesSeasons = [
    {
        name:translate.Summer,
        value:'Summer'
    },
    {
        name:translate.Autumn,
        value:'Autumn',
    },
    {
        name:translate.Winter,
        value:'Winter',
    },
    {
        name:translate.Spring,
        value:'Spring',
    },
    {
        name:translate.DemiSeason,
        value:'Demi-season',
    },
  ];

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [goodInformation, setGoodInformation] = useState({
    name: "", price: '', description: '', article: "", compound: "", brand: "", season: "", pattern: "", country: "",
  });
  const [uploadedImageCount, setUploadedImageCount] = useState(0);
  const [goodSizes, setGoodSizes] = useState<{ [key: string]: number }>({});
  const [images, setImages] = useState<(string | null)[]>([...allImagesBase64]);
  const [isActiveFormGood, setIsActiveFormGood] = useState<boolean>(true);
  const [productColors,setProductColors] = useState<Color[]>([]);
  const [disabledButtonSend,setDisabledButtonSend] = useState<boolean>(false);

  const { returnInputError, returnInputProperties } = useCustomForm<any>();
  const { name, price, description, article, compound, brand, season, pattern, country } = goodInformation;
  const cardPrice = useMemo(() => Math.floor(Number(oneProduct?.price)).toString(), [oneProduct?.price]);
  const checkUsdValue = useMemo(() => `${price}${isActiveFormGood ? ' $ ' : ''}`, [price, isActiveFormGood]);
  //classNames
  const activeButtonsClassName = useMemo(() => ({ display: isActiveFormGood ? 'none' : 'block' }), [isActiveFormGood]);
  const activeLeftTableClassName = useMemo(() => `button-option_left_table ${isActiveFormGood ? '' : 'active'}`, [isActiveFormGood]);

  const inputClassName = useMemo(() => `provider-form-input ${isActiveFormGood ? '' : 'active'}`, [isActiveFormGood]);
  const inputClassNamePrice = useMemo(() => `provider-form-input card-price ${isActiveFormGood ? '' : 'active'}`, [isActiveFormGood]);
  const inputClassNameDescription = useMemo(() => `provider-form-input description ${isActiveFormGood ? '' : 'active'}`, [isActiveFormGood]);
  
  //ADD/CHANGE FUNCTIONS
  const handleDeleteImage = useCallback((index: number) => {
    if (images?.length > 1) {
      const newImages = images?.filter((_, i) => i !== index);
      setImages(newImages);
      setUploadedImageCount(newImages?.length);
    } else {
      showToastMessage('warn', 'Минимум одна фотография');
    }

  }, [images]);
  const handleDeleteSize = useCallback((sizeKey: string) => {
    if (Object.keys(goodSizes).length > 1 && !isActiveFormGood) {
      const newSizes = { ...goodSizes };
      delete newSizes[sizeKey];
      setGoodSizes(newSizes);
      showToastMessage('success', 'Размер успешно удален');
    } else {
      showToastMessage('warn', 'Минимум один размер должен остаться');
    }
  }, [goodSizes, isActiveFormGood]);
  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const newImages = [...images];
      if (newImages.length + files.length > 5) {
        showToastMessage('warn', 'Вы не можете загрузить более 5 фотографий.');
        return;
      }
      for (let i = 0; i < files?.length; i++) {
        const file = files[i];
        const base64 = await convertToBase64(file);
        newImages.push(base64);
      }

      setUploadedImageCount(newImages?.length);
      setImages(newImages);
    }
  }, [images]);
  const addNewSize = useCallback((size: string) => {
    setGoodSizes(prevSizes => ({
      ...prevSizes,
      [size]: 0
    }));
  }, []);
  const handleCountryChange = useCallback((selectedCountryValue: string) => {

    setGoodInformation(prev => ({ ...prev, country: selectedCountryValue }));
  }, []);
  const handleSeasonChange = useCallback((selectedCountryValue: string) => {

    setGoodInformation(prev => ({ ...prev, season: selectedCountryValue }));
  }, []);

  const setActiveForm = useCallback(() => setIsActiveFormGood(prev => !prev), []);

  const changeGoodInformation = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGoodInformation(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);
  const changeSizeInformation = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.length >= 1 && value.length <= 3 && Number(value) >= 1) {
      setGoodSizes(prev => ({
        ...prev,
        [e.target.name]: Number(value)
      }));
    }
  }, []);
  const changeColorInformation = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.length >= 1 && value.length <= 3 && Number(value) >= 1) {
      setProductColors(prevColors => prevColors.map(color =>
        color?.slug === e.target.name ? { ...color, amount: Number(value) } : color
      ));
    }
  }, []);
  
  
  const handleDeleteColor = useCallback((colorId: number) => {
    if (productColors?.length > 1) {
      setProductColors(prevColors => prevColors?.filter(color => color?.id !== colorId));
      showToastMessage('success', 'Цвет успешно удален');
    } else {
      showToastMessage('warn', 'Минимум один цвет должен остаться');
    }
  }, [productColors]);
  const handleAddColor = useCallback(({id,slug,color,amount}: Color) => {
    setProductColors(prevColors => [...prevColors, {id,slug,color,amount}]);
  }, []);
  const filteredColors = useMemo(() => {
    return colors?.filter(color => !productColors?.some(pc => pc?.id === color?.id));
  }, [colors, productColors]);

  //send to server
  const sendNewChanges = useCallback(() => {
    try {
      const sizes_data = Object.entries(goodSizes).map(([name, amount]) => ({ name, amount }));
      const newColors = productColors.map(({ slug, amount }) => ({ slug, amount }));

      const changes = {
        name, description, compound, brand, colors_data: newColors ,sizes_data: sizes_data,images: images,
        manufacturerCountry: country, amount: 2147483647, price, season, pattern, weight: 2147483647
      };
      console.log(changes)
      setDisabledButtonSend(true);

      putProductBySlug(oneProduct?.slug, changes)
        .then(response => {
          if (response) {
            showToastMessage('success', 'Товар успешно изменен');
            setActiveForm();
          } else {
            setDisabledButtonSend(false);
            showToastMessage('error', 'Произошла ошибка при изменении товара');
          }
        })
        .catch((error) => {
          console.error(error);
          showToastMessage('error', 'Произошла ошибка при изменении товара');
        })  
        .finally(()=> setDisabledButtonSend(false))
    } catch (error) {
      showToastMessage('error', 'Ошибка при изменении');
      console.error(error);
    }

  }, [name, description, compound, brand, country, price, season, pattern, goodSizes, oneProduct?.slug,images,productColors]);

  //RENDER-MAP FUNCTIONS
  const renderSlider = useMemo(() => {
    const styles: CSSProperties & { [key: string]: string } = {
      "--swiper-navigation-color": "#fff",
      "--swiper-pagination-color": "#fff",
    };

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
          {images?.map((image, index) => (
          <SwiperSlide key={index}>
              <Image
                src={image || skeleton}
                alt={oneProduct?.name}
                width={400}
                height={400}
                className="swiper-slides-photos"
              />
              {!isActiveFormGood && (
                <button className="delete-button" onClick={() => handleDeleteImage(index)}>
                  <Icons id='deleteCard'/>
                </button>
              )}
          </SwiperSlide>
        ))}
        </Swiper>

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
                src={image || skeleton}
                alt={oneProduct?.name}
                width={90}
                height={90}
                className="swiper-slides-photos lil"
              />
              {!isActiveFormGood && (
                <button className="delete-button lil" onClick={() => handleDeleteImage(index)}>
                  <Icons id='deletePhotoLil'/>
                </button>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
           {!isActiveFormGood && (
             <div className="upload-wrapper">
              <input
                className="addPhotos"
                type="file"
                multiple
                onChange={handleUpload}
                id="file-upload"
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
  }, [handleDeleteImage, images, isActiveFormGood, oneProduct?.name, thumbsSwiper]);

  const mapProductColors = () => productColors?.map((item, index) => (
    <button
      onClick={() => handleDeleteColor(item?.id)}
      disabled={isActiveFormGood}
      key={index}
      className={!isActiveFormGood ? "button-option_color active" : "button-option_color"}
      style={{backgroundColor:item?.color}}
      value={item?.slug}
    >
    </button>
));
  const renderSizesButton = () => Object?.entries(goodSizes)?.map(([size],index) => (
    <button
      key={index}
      className={!isActiveFormGood ? "button-option_size active" : "button-option_size"}
      disabled={isActiveFormGood}
      value={size}
      onClick={() => handleDeleteSize(size)}
    >
        {size}
    </button>
  ));
  //sizesTable
  const renderSizes = () => Object?.entries(goodSizes)?.map(([size, count],index) => (
    <div className="product-info sizes" key={index}>
      <p className="text-textAcc">{translate.sizeProduct} {size}:</p>
      <input
        name={size}
        className={inputClassName}
        value={count}
        onChange={changeSizeInformation}
        disabled={isActiveFormGood}
        minLength={1}
        maxLength={3}
        type="number"
      />
    </div>
  ));
  const renderSizesToChooseInDropDownMenu = () => {
    const filteredSizes = sizesArray.filter(sizeObj =>!Object?.entries(goodSizes)?.some(([size]) => size === sizeObj?.size)
    );

    if(!isActiveFormGood) return (
      <DropdownMenu aria-label="Available Sizes" className='Dropdown-buttons' >
        {
          filteredSizes?.map(sizeObj => (
            <DropdownItem className='drop-buttons'  key={sizeObj?.size} onClick={() => addNewSize(sizeObj?.size)}>
              {sizeObj?.size}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
      )
  };
  const renderColorsToChooseInDropDownMenu = () => {
    if(!isActiveFormGood) return(
      <DropdownMenu aria-label="Available Colors" className='Dropdown-buttons-color'>
      {
        filteredColors?.map((color,index) => (
          <DropdownItem
            key={index}
            className='button-option_color drop'
            style={{ backgroundColor: color?.color }}
            onClick={() => handleAddColor(color)}
          >
            {}
          </DropdownItem>
        ))
      }
    </DropdownMenu>
    )
};
  const renderCountriesToChooseInDropDownMenu = () => {

  if(!isActiveFormGood) return (
    <DropdownMenu aria-label="Available Sizes" className='Dropdown-buttons' >
      {
        manufacturiesCountries?.map(({name,value}) => (
          <DropdownItem className='drop-buttons'  key={value} onClick={()=> handleCountryChange(value)}>
            {name}
          </DropdownItem>
        ))
      }
    </DropdownMenu>
    )
  };
  const renderSeasonsToChooseInDropDownMenu = () => {

    if(!isActiveFormGood) return (
      <DropdownMenu aria-label="Available Sizes" className='Dropdown-buttons' >
        {
          clothesSeasons?.map(({name,value}) => (
            <DropdownItem className='drop-buttons'  key={value} onClick={()=> handleSeasonChange(value)}>
              {name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
      )
    };
  //colorsTable
  const renderColorsTable = () => productColors?.map(({ slug, amount }, index) => (
    <div className="product-info colors" key={index}>
      <p className="text-textAcc">{translate.colorProduct} {slug}:</p>
      <input
        name={slug}
        className={inputClassName}
        value={amount}
        onChange={changeColorInformation}
        disabled={isActiveFormGood}
        minLength={1}
        maxLength={3}
        type="number"
      />
    </div>
  ));

  useEffect(() => {
    setGoodInformation({
      name: oneProduct?.name,
      price: cardPrice,
      description: oneProduct?.description,
      article: oneProduct?.article_number,
      compound: oneProduct?.compound,
      brand: oneProduct?.brand?.name,
      season: oneProduct?.season,
      pattern: oneProduct?.pattern,
      country: oneProduct?.manufacturerCountry?.slug,
    });
    

    const sizes = oneProduct?.sizes_data?.reduce((acc, { name, amount }) => {
      acc[name] = amount || 0;
      return acc;
    }, {} as { [key: string]: number });

    setProductColors(oneProduct?.colors_data)
    setGoodSizes(sizes);
    setUploadedImageCount(images?.length);
  }, [language]);

  useEffect(()=>{
    onGetColors()
  },[onGetColors])


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
                  onChange={changeGoodInformation} 
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
                  onChange={changeGoodInformation} 
                  readOnly={true}
                  minLength={3}
                  maxLength={24}
                  disabled={isActiveFormGood}
                />
                {returnInputError("article")}
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.productPageCompound}:</p>
                <input
                  {...returnInputProperties("compound")}
                  className={inputClassName}
                  value={compound}
                  onChange={changeGoodInformation} 
                  readOnly={isActiveFormGood}
                  minLength={3}
                  maxLength={24}
                  disabled={isActiveFormGood}
                />
                {returnInputError("compound")}
                {/* <p className="family-medium truncate">{oneProduct?.compound}</p> */}
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.productPageManufacturer}:</p>
                <input
                  {...returnInputProperties("brand")}
                  className={inputClassName}
                  value={brand}
                  onChange={changeGoodInformation} 
                  readOnly={isActiveFormGood}
                  minLength={3}
                  maxLength={24}
                  disabled={isActiveFormGood}
                />
                {returnInputError("brand")}
                {/* <p className="family-medium truncate">{oneProduct?.brand?.name}</p> */}
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
                  
                    {renderSeasonsToChooseInDropDownMenu()}
                  </Dropdown>
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.productPagePattern}:</p>
                <input
                  {...returnInputProperties("pattern")}
                  className={inputClassName}
                  value={pattern}
                  onChange={changeGoodInformation} 
                  readOnly={isActiveFormGood}
                  minLength={3}
                  maxLength={24}
                  disabled={isActiveFormGood}
                />
                {returnInputError("pattern")}
              </div>
              <div className="product-info">
                <p className="text-textAcc">{translate.productPageCountry}:</p>
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        disabled={isActiveFormGood}
                        className={activeLeftTableClassName}
                      >
                        {country}
                        <Icons id='arrowDownProfile'/>
                      </button>
                    </DropdownTrigger>
                  
                    {renderCountriesToChooseInDropDownMenu()}
                  </Dropdown>
              </div>
            </div>

            <div className="product-block-2 flex flex-col gap-[15px]">
              <div className="sizes-table">
                <p>{translate.sizes}:</p>
                 {renderSizes()}
              </div>
              <div className="colors-table">
                <p>{translate.kits}:</p>
                {renderColorsTable()}
              </div>
            </div>

              <div className="right-wrapper_color_sizes">

              <input
                  {...returnInputProperties("price")}
                  className={inputClassNamePrice}
                  value={checkUsdValue}
                  onChange={changeGoodInformation} 
                  readOnly={isActiveFormGood}
                  minLength={3}
                  disabled={isActiveFormGood}
                  maxLength={11}
                />
                {returnInputError("price")}
                
                <p className="text-textAcc">{translate.productPageInStock}:</p>

                <div className="renderSizes">
                  {renderSizesButton()}
                  <Dropdown classNames={{content:'Dropdown-wrapper'}}>
                    <DropdownTrigger>
                      <button
                        className="button-option_size add"
                        style={activeButtonsClassName}
                        onClick={()=> addNewSize}
                      >
                        +
                      </button>
                    </DropdownTrigger>
                  
                    {renderSizesToChooseInDropDownMenu()}

                  </Dropdown>
                </div>

                <div className="renderColors">
                  {mapProductColors()}
                  <Dropdown classNames={{content:'Dropdown-wrapper-color'}}>
                    <DropdownTrigger>
                      <button
                          style={isActiveFormGood ? {display:'none'} : {display:"block"}}
                          className="button-option_color add"
                        >
                          +
                      </button>
                    </DropdownTrigger>
                  
                    {renderColorsToChooseInDropDownMenu()}

                  </Dropdown>
                </div>
              </div>
            </div>

         
          </div>
        </div>

        <div className="product-page_description">
          <p className="text-[24px] family-medium">{translate.productPageDescription}:</p>
            <input
                  name='description'
                  className={inputClassNameDescription}
                  value={description}
                  onChange={changeGoodInformation} 
                  disabled={isActiveFormGood}
                  minLength={3}
              />
        </div>
      </div>
    </main>
)};