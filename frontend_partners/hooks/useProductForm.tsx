import { useCallback, useMemo,useEffect,useState } from "react";
import { DropdownMenu, DropdownItem,Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import { convertToBase64 } from "@/utils/Functions";
import { showToastMessage } from "@/app/toastsChange";
import { Color } from "@/types/additionalTypes";
import { useTypedSelector } from "./useTypedSelector";
import { useUserActions } from "./useUserActions";
import { useTranslate } from "./useTranslate";
import { ProductFormArguments,GoodInformationBase } from "@/types/additionalTypes";
import { getAllCategories,getSizesClothes,getTypesByChildren } from "@/services/providerAPI";
import { useCustomForm } from "./useCustomForm.";
import '@/components/CreateNewProduct/CreateNewProductComponent.scss';

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  level: number;
  parent: number | null;
}
const useProductForm = <T extends GoodInformationBase>(productFormArguments: ProductFormArguments<T>) => {
    //Hooks
    const {colors,statusProduct} = useTypedSelector(state => state.product);
    const {countries} = useTypedSelector(state => state.user);

    const {onGetColors,onGetCountries} = useUserActions();
    const translate = useTranslate();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { returnInputError, returnInputProperties, isValid } = useCustomForm<any>();
  
   //Arrays
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
  const moldArray = [
    {
      name:translate.moldOversize,
      value:"Oversize"
    },
    {
      name: translate.moldSlim,
      value:"Slim"
    },
    {
      name:translate.moldSkinny,
      value:"Skinny"
    },
    {
      name:translate.moldNormal,
      value:"Normal"
    },
    {
      name:translate.moldNoMold,
      value:"No-mold"
    },
  ];
  const materialArray = [
    {
      name:translate.cotton,
      value:"Cotton"
    },
    {
      name:translate.polyester,
      value:"Polyester"
    },
    {
      name:translate.wool,
      value:"Wool"
    },
    {
      name:translate.silck,
      value:"Silk"
    },
    {
      name:translate.linen,
      value:"Linen"
    },
    
  ]

  const [clothesSize,setClothesSize] = useState<string>('');
  const {images, setImages,
        isActiveFormGood,
        uploadedImageCount, setUploadedImageCount,
        goodSizesClothes, setGoodSizesClothes,
        productColors, setProductColors,
        goodInformation, setGoodInformation} = productFormArguments;
  const [categories,setCategories] = useState<{
          categories: Category[];
          type: Category[];
          subtype: Category[];
        }>({
            categories:[],
            type:[],
            subtype:[]
        });
  const [choosenCategory,setChoosenCategory] = useState({
    categories:'',
    type:'',
    subtype:{slug:'',id: 0}
 });
 const [clothesSizesArray,setClothesSizesArray] = useState<{ [key: string]: number }>({});

  //Get
  const getCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response?.status === 200) {

        setCategories((prevCategories) => ({
          ...prevCategories,
          categories: response.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const getClothesSizes = async () => {
    try {
      const response = await getSizesClothes();
      if (response?.status === 200) {

      const sizes = response.data?.reduce((acc: { [key: string]: number }, { name, amount }:{name: string,amount: number}) => {
        acc[name] = amount || 0;
        return acc;
      }, {} as { [key: string]: number });

        setClothesSizesArray(sizes);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const getTypeByChildren = async (children: number) =>{
    try {
      const response = await getTypesByChildren(children);

      if (response?.status === 200) {
        setCategories((prevCategories) => ({
          ...prevCategories,
          type: response.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const getSubtypeByChildren = async (children: number) =>{
    try {
      const response = await getTypesByChildren(children);
      if (response?.status === 200) {
        setCategories((prevCategories) => ({
          ...prevCategories,
          subtype: response.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  //Handle
  const handleDeleteImage = useCallback((index: number) => {
    if (images?.length > 1) {
      const newImages = images?.filter((_, i) => i !== index);
      setImages(newImages);
      setUploadedImageCount(newImages?.length);
    } else {
      showToastMessage('warn', translate.notifyMinimumPhoto);
    }
  }, [images]);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = [...images];
      if (newImages.length + files.length > 5) {
        showToastMessage('warn', translate.notifyMaximumPhoto);
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

  const handleDeleteColor = useCallback((colorId: number) => {
    if (productColors?.length > 1) {
      setProductColors(prevColors => prevColors?.filter(color => color?.id !== colorId));
      showToastMessage('success', translate.notifyDeleteColor);
    } else {
      showToastMessage('warn', translate.notifyMinimumColor);
    }
  }, [productColors]);

  const handleAddColor = useCallback(({id,slug,color,amount}: Color) => {
    setProductColors(prevColors => [...prevColors, {id,slug,color,amount:1}]);
  }, []);

  const handleDeleteSize = useCallback((sizeKey: string) => {

    if (Object.keys(goodSizesClothes).length > 1 && !isActiveFormGood) {
      const newSizes = { ...goodSizesClothes };
      delete newSizes[sizeKey];
      //Удаляем из отрисованных
      setGoodSizesClothes(newSizes);
      showToastMessage('success', translate.notifySizeDelete);
      //Добавляем в общие
      setClothesSizesArray(prevSizes => ({
        ...prevSizes,
        [sizeKey]: 0
      }));
    } else {
      showToastMessage('warn', translate.notifyMinimumSize);
    }
  }, [goodSizesClothes, isActiveFormGood]);

  const addNewSize = useCallback((size: string) => {
    // Добавляем размер в goodSizesClothes
    setGoodSizesClothes(prevSizes => ({
      ...prevSizes,
      [size]: 1
    }));

    // Удаляем размер из clothesSizesArray
    setClothesSizesArray(prevSizes => {
      const updatedSizes = { ...prevSizes };
      delete updatedSizes[size];
      return updatedSizes;
    });
  }, []);
  

  const handleCountryChange = useCallback((selectedCountryValue: number,selectedCountryName: string) => {

    setGoodInformation(prev => ({ ...prev, country: {
      name:selectedCountryName,
      id:selectedCountryValue
    } }));
  }, []);

  const handleSeasonChange = useCallback((selectedCountryValue: string) => {

    setGoodInformation(prev => ({ ...prev, season: selectedCountryValue }));
  }, []);

  const handleCategoryClick = useCallback((category: string) => {
    setChoosenCategory((prevCategory) => ({
      ...prevCategory,
      categories: category,
      type: '',
      subtype:{slug:'',id: 0}
    }));
  },[]);

  const handleTypeClick = useCallback((type: string) => {
    setChoosenCategory((prevCategory) => ({
      ...prevCategory,
      type: type,
      subtype:{slug:'',id: 0}
    }));
  },[]);

  const handleSubtypeClick = useCallback((subtype: string,id: number) => {
    setChoosenCategory((prevCategory) => ({
      ...prevCategory,
      subtype: {slug: subtype, id:id}
    }));
  },[]);

  const handleMoldClick = useCallback((selectedMold: string) => {
    setGoodInformation((prev) => ({...prev, mold: selectedMold}));
  },[]);
  const handleMaterialClick = useCallback((selectedMaterial: string) => {
    setGoodInformation((prev) => ({...prev, material: selectedMaterial}));
  },[]);


  //onChange
  const changeGoodInformation = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setGoodInformation(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);
  const changeSizeInformation = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (value.length >= 1 && value.length <= 3 && Number(value) >= 1) {
      setGoodSizesClothes(prev => ({
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



  //Filter/Sort
  const filteredColors = useMemo(() => {
    return colors?.filter(color  => !productColors?.some(pc => pc?.id === color?.id));
  }, [colors, productColors]);



  //Tables
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
  const renderSizesButton = () => {
      return(
          Object?.entries(goodSizesClothes)?.map(([size],index) => (
            <button
              key={index}
              className={!isActiveFormGood ? "button-option_size active" : "button-option_size"}
              disabled={isActiveFormGood}
              value={size}
              onClick={() => handleDeleteSize(size)}
            >
                {size}
            </button>
          ))
        )
  };
  const renderSizes = () => {
    return(
        Object?.entries(goodSizesClothes)?.map(([size, count],index) => (
          <div className="product-info sizes" key={index}>
            <p className="text-textAcc">{translate.sizeProduct} {size}:</p>
            <input
              name={size}
              className={isActiveFormGood ? 'provider-form-input' : 'provider-form-input active'}
              value={count}
              onChange={(event)=> changeSizeInformation(event)}
              disabled={isActiveFormGood}
              minLength={1}
              maxLength={3}
              type="number"
            />
          </div>
        ))
      );
  };
  const renderColorsTable = () => productColors?.map(({ slug, amount }, index) => (
    <div className="product-info colors" key={index}>
      <p className="text-textAcc"> {slug}:</p>
      <input
        name={slug}
        className={isActiveFormGood ? 'provider-form-input' : 'provider-form-input active'}
        value={amount}
        onChange={changeColorInformation}
        disabled={isActiveFormGood}
        minLength={1}
        maxLength={3}
        type="number"
      />
    </div>
  ));
  const renderSizesToModal = () => {

    if (!clothesSize.trim()) {
      return null;
    }
    const sizesArray = Object.entries(clothesSizesArray).map(([name, id]) => ({ name, id }));

    // Фильтруем размеры на основе введенного текста
    const filteredSizes = sizesArray.filter(size =>
      size.name.toUpperCase().includes(clothesSize.toUpperCase())
    );


    return filteredSizes?.map(({name,id},index) => (
      <button
        key={index}
        className="button-option_size add"
        disabled={isActiveFormGood}
        value={name}
        onClick={() => addNewSize(name)}
      >
          {name}
      </button>
    ))
  };

  const renderClothesSizesInModal = () => {
    if(!isActiveFormGood){
        return (
          <>
           <button onClick={onOpen} className="button-option_size add">
              +
          </button>
          <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">{translate.writeShoeSize}</ModalHeader>

                  <ModalBody>
                    <Input
                     {...returnInputProperties("clothesSize")}
                      onChange={event => setClothesSize(event.target.value)}
                      autoFocus
                      label={translate.filterSize}
                      placeholder={translate.writeShoeSize}
                      maxLength={5}
                    />
                   {returnInputError("clothesSize")}

                     <div className="flex flex-row flex-wrap gap-[10px]">
                       {renderSizesToModal()}
                     </div>


                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
        );
      }
  }
  //Dropdown
  const renderColorsToChooseInDropDownMenu = () => {
    if(!isActiveFormGood) return(
      <DropdownMenu aria-label="Available Colors" className='Dropdown-buttons-color'>
      {
        filteredColors?.map((color,index) => (
          <DropdownItem
            textValue="color"
            key={index}
            className='button-option_color drop'
            style={{ backgroundColor: color?.color }}
            onClick={() => handleAddColor(color)}
            onTouchStart={() => handleAddColor(color)}
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
    <DropdownMenu aria-label="Available Countries" className='Dropdown-buttons' >
      {
        countries?.map(({name,id}) => (
          <DropdownItem textValue="country" className='drop-buttons'  key={id} onTouchStart={()=> handleCountryChange(id,name)} onClick={()=> handleCountryChange(id,name)}>
            {name}
          </DropdownItem>
        ))
      }
    </DropdownMenu>
    )
  };
  const renderSeasonsToChooseInDropDownMenu = () => {

    if(!isActiveFormGood) return (
      <DropdownMenu aria-label="Available Seasons" className='Dropdown-buttons' >
        {
          clothesSeasons?.map(({name,value}) => (
            <DropdownItem textValue="season" className='drop-buttons'  key={value} onTouchStart={()=> handleSeasonChange(value)} onClick={()=> handleSeasonChange(value)}>
              {name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
      )
  };
  const renderCategoriesToChooseInDropDownMenu = () => {

    if(!isActiveFormGood) return (
      <DropdownMenu aria-label="Available Categories" className='Dropdown-buttons' >
        {
          categories.categories?.map(({name,id,slug}) => (
            <DropdownItem textValue="category" className='drop-buttons' key={id} onClick={()=> {getTypeByChildren(id); handleCategoryClick(slug)}} onTouchStart={()=> {getTypeByChildren(id); handleCategoryClick(slug)}}>
              {name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
      )
  };
  const renderTypesToChooseInDropDownMenu = () => {

    if(!isActiveFormGood) return (
      <DropdownMenu aria-label="Available Types" className='Dropdown-buttons' >
        {
          categories.type?.map(({name,id,slug}) => (
            <DropdownItem textValue="type" className='drop-buttons' key={id} onClick={()=> {getSubtypeByChildren(id);handleTypeClick(slug)}} onTouchStart={()=> {getSubtypeByChildren(id);handleTypeClick(slug)}}>
              {name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
      )
  };
  const renderSubtypesToChooseInDropDownMenu = () => {

    if(!isActiveFormGood) return (
      <DropdownMenu aria-label="Available Subtypes" className='Dropdown-buttons' >
        {
          categories.subtype?.map(({name,id,slug}) => (
            <DropdownItem textValue="subtype" className='drop-buttons' key={id} onClick={()=> handleSubtypeClick(slug,id)} onPointerDown={()=> handleSubtypeClick(slug,id)}>
              {name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
      )
  };
  const renderMoldsToChooseInDropDownMenu = () => {

    if(!isActiveFormGood) return (
      <DropdownMenu aria-label="Available Mold" className='Dropdown-buttons' >
        {
          moldArray?.map(({name,value}) => (
            <DropdownItem textValue="mold" className='drop-buttons' key={value} onClick={()=> handleMoldClick(value)} onTouchStart={()=> handleMoldClick(value)}>
              {name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
      )
  };
  const renderMaterialToChooseInDropDownMenu = () => {

    if(!isActiveFormGood) return (
      <DropdownMenu aria-label="Available Mold" className='Dropdown-buttons' >
        {
          materialArray?.map(({name,value}) => (
            <DropdownItem textValue="mold" className='drop-buttons' key={value} onClick={()=> handleMaterialClick(value)} onTouchStart={()=> handleMaterialClick(value)}>
              {name}
            </DropdownItem>
          ))
        }
      </DropdownMenu>
      )
  };


  useEffect(() => {
    getCategories();
    getClothesSizes();
  },[]);

  useEffect(()=>{
    onGetColors();
  },[onGetColors]);

  useEffect(()=>{
    onGetCountries();
  },[onGetCountries])


  //Временное решение
  useEffect(()=>{
    if((statusProduct === 'fulfilled' && colors?.length) && !productColors?.length){
      setProductColors([{...colors[0],amount:1}]);
    }
  },[colors,statusProduct]);

  return{
    handleAddColor,
    handleCountryChange,
    handleDeleteColor,
    handleDeleteImage,
    handleDeleteSize,
    handleSeasonChange,
    handleUpload,
    filteredColors,
    renderColorsTable,
    renderColorsToChooseInDropDownMenu,
    renderCountriesToChooseInDropDownMenu,
    renderSeasonsToChooseInDropDownMenu,
    renderCategoriesToChooseInDropDownMenu,
    renderTypesToChooseInDropDownMenu,
    renderSubtypesToChooseInDropDownMenu,
    renderMaterialToChooseInDropDownMenu,
    renderSizes,
    renderSizesButton,
    renderClothesSizesInModal,
    goodInformation,
    mapProductColors,
    changeGoodInformation,
    addNewSize,
    getTypeByChildren,
    getSubtypeByChildren,
    choosenCategory,
    renderMoldsToChooseInDropDownMenu,
    images,
  }
};

export { useProductForm };
