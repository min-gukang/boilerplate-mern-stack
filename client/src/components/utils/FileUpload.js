import React, {useState} from 'react'
import Dropzone from 'react-dropzone'
import {Icon} from 'antd' //css 라이브러리 
import axios from 'axios'


function FileUpload(props) {
    //'확인'을 눌렀을 때 업로드된 이미지 저장??
    //근데 이 이미지들은 부모 컴포넌트에서 관리해야함. submit버튼을 눌렀을 때 백엔드로 같이 보내주기 위해.. 
    const [Images, setImages] = useState([]);

    //dropzone을 이용해 파일을 백엔드로 보내준다.(axios로) 
    const dropHandler = (files) => {
        let formData = new FormData();
        console.log(files); //[ {사진파일} ] => 하나가 들어간다. 
        const config = {
            header : { 'content-type' : 'multipart/form-data'} //백엔드에 어떠한 파일인지 알려주는 정보. 
        }
        formData.append("file", files[0]); //우리가 올린 이미지에 대한 정보가 formData에 들어감. 
        console.log(formData);
        //파일을 백엔드에 보낸다. 이렇게 formData, config를 넣어주지 않으면 error가 난다. 
        //근데 axios는 fetch처럼 http://localhost:5000 이게 생략되 있네.. 
        axios.post('/api/product/image', formData, config)
            .then(response => {
                if(response.data.success) {
                    console.log(response) //response객체 안에 위에 설정한 config가 있네 . 
                    // console.log(response.data);
                    setImages([...Images, response.data.filePath]) //filePath로 저장하는 이유는 경로를 설정해야 경로를따라 이미지를 찾을테니까..
                    props.refreshFunction([...Images, response.data.filePath]); //image state 부모 컴포로 끌어올리기
                } else {
                    alert('파일 저장이 실패했습니다.');
                }
            })
    }

    //업로드된 사진 클릭시 제거하는 기능 
    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images];
        if(currentIndex !== -1) {
          newImages.splice(currentIndex, 1);
        }
        setImages(newImages)
        props.refreshFunction(newImages); //image state 끌어올리기
    }

    return (
        <div style={{display : 'flex', justifyContent : 'space-between'}}>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    <div 
                        style={{
                            width : 300, height : 240, border : '1px solid lightgray',
                            display : 'flex', alignItems : 'center', justifyContent : 'center'
                        }}
                    {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Icon type="plus" style={{fontSize: '3rem'}} />
                    </div>  
                )}
            </Dropzone>
            {/* 업로드한 파일 렌더하는 부분 */}
            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll'}}>
                {Images.map((image, index) => (
                    // 이미지 클릭시 삭제부분 구현(클릭된 이미지 파라미터로 넣음)
                    <div key={index} onClick={() => deleteHandler(image)} >
                        <img style={{minWidth :'300px', width: '300px', height: '240px'}} 
                            src ={`http://localhost:5000/${image}`} />
                    </div>
                ))}
            </div>

        </div>
    )
}

export default FileUpload