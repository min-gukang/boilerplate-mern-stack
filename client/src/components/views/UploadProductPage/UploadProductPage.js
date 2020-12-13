import React, {useState} from 'react'
import FileUpload from '../../utils/FileUpload'
import {Typography, Button, Form, Input} from 'antd'; //css 프레임워크 빌려서 디자인한다. 
import axios from 'axios';

const {Title} = Typography;
const {TextArea} = Input;

const Continents = [
    { key: 1, value: "Africa" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Asia" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Australia" },
    { key: 7, value: "Antarctica" }
]

function UploadProductPage(props) {
    const [name, setName] = useState(""); //이게 hooks,  useState 괄호안에 initialState가 들어간다. 
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [Continent, setContinent] = useState(1);
    const [images, setImages] = useState([]);

    // const ContinentOnchangeHandler = (e) => {
    //     setContinent(e.)
    // }
    const nameChangeHandler = (e) => {
        setName(e.currentTarget.value); 
    }
    const desChangeHandler = (e) => {
        setDescription(e.target.value);
    }
    const priceChangeHandler = (e) => {
        setPrice(e.currentTarget.value);
    }
    const continentChangeHandler = (event) => {
        setContinent(event.currentTarget.value)
    }
    const updataImages = (images) => { //자식 컴포넌트인 fileUpload의 state에 저장된 이미지들을 부모컴포넌트로 가져옴. 
        setImages([...images])
        console.log(images);
    }
    const submitHandler = (event) => { //이거 자체가 안눌림
        event.preventDefault();//버튼클릭시 화면 리프레쉬 방지
        if(!name || !description || !price || !images) {
            return alert('모든 값을 넣어야 합니다')
        }

        const body = {
            //로그인된 사람의 아이디, auth.js에서 가져온다. 또는 redux에서 가져올 수 있다. 
            writer : props.user.userData._id,
            name : name,
            description : description,
            price : price,
            images : images,
            continents : Continent
        }

        //채운 값들을 리퀘스트요청을 통해 서버로 보낸다. 근데 full url을 안써도 되나??
        axios.post("/api/product", body) //서버에 가서 이것과 관련된 라우트를 또 만든다. 만드는게 아니라 아까 만든거에 작성
            .then(response => {
                if(response.data.success) {
                    alert('상품 업로드에 성공했습니다.');
                    props.history.push('/') //성공하면 '/'경로로 간다. 
                } else {
                    alert('상품 업로드에 실패했습니다.');
                }

            })
    }


    return (
        <div style={{ maxWidth: '700px', margin : '2rem auto'}}>
            <div style={{ textAlign: 'center', marginbottom: '2rem' }}>           
                <Title level={2}>여행 상품 업로드</Title>
            </div>

            <Form onSubmit={submitHandler}>
                {/* drop zone=> 이 파일 업로드 부분은 다른데서도 쓸 수 있기 때문에 컴포넌트를 새로만들어서 가져다 쓴다. */}
                <FileUpload refreshFunction={updataImages}/>

                <br />
                <br />
                <lable>이름</lable>
                <Input onChange={nameChangeHandler} value={name} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={desChangeHandler} value={description}/>
                <br />
                <br />
                <label>가격($)</label>
                <Input onChange={priceChangeHandler} value={price}/>
                <br />
                <br />
                <select onChange={continentChangeHandler} value={Continent}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}> {item.value}</option>
                    ))}
                </select>
                <br />
                <br />
                {/* 왜 Button은 안먹히지...  */}
                <button type="submit"> 
                    확인
                </button>
            </Form>
        </div>
    )
}

export default UploadProductPage