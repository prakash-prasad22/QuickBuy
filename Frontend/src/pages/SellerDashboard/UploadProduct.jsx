import { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../../utils/UploadImage';
import Loading from '../../components/Loading';
import ViewImage from '../../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../../components/SellerDashboard/AddFieldComponent';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import AxiosToastError from '../../utils/AxiosToastError';
import successAlert from '../../utils/SuccessAlert';

const UploadProduct = () => {
  const seller = useSelector(state => state.user._id)
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
      seller : seller
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")


  const handleChange = (e)=>{
    const { name, value} = e.target 

    setData((preve)=>{
      return{
          ...preve,
          [name]  : value
      }
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)
  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{
          ...preve
        }
      })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
      return{
          ...preve,
          more_details : {
            ...preve.more_details,
            [fieldName] : ""
          }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log("data",data)

    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : data
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })

      }
    } catch (error) {
        AxiosToastError(error)
    }


  }

  // useEffect(()=>{
  //   successAlert("Upload successfully")
  // },[])
  return (
    <section className='p-0'>
        <div className='px-2 lg:p-2 bg-white shadow-md '>
            <h2 className='heading px-4'>Upload Product</h2>
        </div>
        <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                  <label htmlFor='name' className='form_label'>Name</label>
                  <input 
                    id='name'
                    type='text'
                    placeholder='Enter product name'
                    name='name'
                    value={data.name}
                    onChange={handleChange}
                    required
                    className='form_input'
                  />
                </div>
                <div className='grid gap-1'>
                  <label htmlFor='description' className='form_label'>Description</label>
                  <textarea 
                    id='description'
                    type='text'
                    placeholder='Enter product description'
                    name='description'
                    value={data.description}
                    onChange={handleChange}
                    required
                    multiple 
                    rows={3}
                    className='form_input'
                  />
                </div>
                <div>
                    <p className='form_label'>Image</p>
                    <div>
                      <label htmlFor='productImage' className='bg-blue-50 h-18 border rounded flex justify-center items-center cursor-pointer'>
                          <div className='text-center flex justify-center items-center flex-col'>
                            {
                              imageLoading ?  <Loading/> : (
                                <>
                                   <FaCloudUploadAlt size={35}/>
                                   <p>Upload Image</p>
                                </>
                              )
                            }
                          </div>
                          <input 
                            type='file'
                            id='productImage'
                            className='hidden'
                            accept='image/*'
                            onChange={handleUploadImage}
                          />
                      </label>
                      {/**display uploded image*/}
                      <div className='flex flex-wrap gap-4'>
                        {
                          data.image.map((img,index) =>{
                              return(
                                <div key={img+index} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                                  <img
                                    src={img}
                                    alt={img}
                                    className='w-full h-full object-scale-down cursor-pointer' 
                                    onClick={()=>setViewImageURL(img)}
                                  />
                                  <div onClick={()=>handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                                    <MdDelete/>
                                  </div>
                                </div>
                              )
                          })
                        }
                      </div>
                    </div>

                </div>
                <div className='grid gap-1'>
                  <label className='form_label'>Category</label>
                  <div>
                    <select
                      className='form_input'
                      value={selectCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        const category = allCategory.find(el => el._id === value )
                        
                        setData((preve)=>{
                          return{
                            ...preve,
                            category : [...preve.category,category],
                          }
                        })
                        setSelectCategory("")
                      }}
                    >
                      <option value={""}>Select Category</option>
                      {
                        allCategory.map((c,index)=>{
                          return(
                            <option key={index} value={c?._id}>{c.name}</option>
                          )
                        })
                      }
                    </select>
                    <div className='flex flex-wrap gap-3'>
                      {
                        data.category.map((c,index)=>{
                          return(
                            <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                              <p>{c.name}</p>
                              <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveCategory(index)}>
                                <IoClose size={20}/>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className='grid gap-1'>
                  <label className='form_label'>Sub Category</label>
                  <div>
                    <select
                      className='form_input'
                      value={selectSubCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        const subCategory = allSubCategory.find(el => el._id === value )

                        setData((preve)=>{
                          return{
                            ...preve,
                            subCategory : [...preve.subCategory,subCategory]
                          }
                        })
                        setSelectSubCategory("")
                      }}
                    >
                      <option value={""} className='text-neutral-600'>Select Sub Category</option>
                      {
                        allSubCategory.map((c,index)=>{
                          return(
                            <option key={index} value={c?._id}>{c.name}</option>
                          )
                        })
                      }
                    </select>
                    <div className='flex flex-wrap gap-3'>
                      {
                        data.subCategory.map((c,index)=>{
                          return(
                            <div key={c._id+index+"productsection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                              <p>{c.name}</p>
                              <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveSubCategory(index)}>
                                <IoClose size={20}/>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='unit' className='form_label'>Unit</label>
                  <input 
                    id='unit'
                    type='text'
                    placeholder='Enter product unit'
                    name='unit'
                    value={data.unit}
                    onChange={handleChange}
                    required
                    className='form_input'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='stock' className='form_label'>Number of Stock</label>
                  <input 
                    id='stock'
                    type='number'
                    placeholder='Enter product stock'
                    name='stock'
                    value={data.stock}
                    onChange={handleChange}
                    required
                    className='form_input'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='price' className='form_label'>Price</label>
                  <input 
                    id='price'
                    type='number'
                    placeholder='Enter product price'
                    name='price'
                    value={data.price}
                    onChange={handleChange}
                    required
                    className='form_input'
                  />
                </div>

                <div className='grid gap-1'>
                  <label htmlFor='discount' className='form_label'>Discount</label>
                  <input 
                    id='discount'
                    type='number'
                    placeholder='Enter product discount'
                    name='discount'
                    value={data.discount}
                    onChange={handleChange}
                    required
                    className='form_input'
                  />
                </div>


                {/**add more field**/}
                  {
                    Object?.keys(data?.more_details)?.map((k,index)=>{
                        return(
                          <div key={index} className='grid gap-1'>
                            <label htmlFor={k} className='form_label'>{k}</label>
                            <input 
                              id={k}
                              type='text'
                              value={data?.more_details[k]}
                              onChange={(e)=>{
                                  const value = e.target.value 
                                  setData((preve)=>{
                                    return{
                                        ...preve,
                                        more_details : {
                                          ...preve.more_details,
                                          [k] : value
                                        }
                                    }
                                  })
                              }}
                              required
                              className='form_input'
                            />
                          </div>
                        )
                    })
                  }

                <div onClick={()=>setOpenAddField(true)} className=' hover:secondaryColor bg-white py-1 px-3 w-32 text-center font-semibold border border-secondaryColor hover:text-neutral-900 cursor-pointer rounded'>
                  Add Fields
                </div>

                <button
                  className='bg-primary-100 hover:bg-primary-200 py-4 rounded font-semibold'
                >
                  Submit
                </button>
            </form>
        </div>

        {
          ViewImageURL && (
            <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
          )
        }

        {
          openAddField && (
            <AddFieldComponent 
              value={fieldName}
              onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField}
              close={()=>setOpenAddField(false)} 
            />
          )
        }
    </section>
  )
}

export default UploadProduct
