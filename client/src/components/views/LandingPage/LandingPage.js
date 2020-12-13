import React, {useEffect, useState}from 'react'
import { FaCode } from "react-icons/fa";
import axios from 'axios';
import {Icon, Col, Card, Row, Carousel} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'
import CheckBox from './Sections/CheckBox'
import RadioBox from './Sections/RadioBox'
import {Continents, Price} from './Sections/Datas'

function LandingPage() {
    //랜딩되는 카드를 유동적으로 관리하기 위해..
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8);
    const [PostSize, setPostSize] = useState(0);
    const [Filters, setFilters] = useState({
        continents : [],
        price : []
    })
    //landing page에 상품들을 백엔드서버(db)에서 가져오기 
    //useEffect Hook을 componentDidMount와 componentDidUpdate, componentWillUnmount가 합쳐진 것으로 생각해도 좋습니다
    useEffect(() => { 
        //왜 post방식으로 가져오지. get이 아니라.. 
         //데이터 보낼때 넣는 값들은 Post에서 더욱 안전하게 보내지며   
        // post에서는 Body로 보내지고 get에서는 query 나 param으로  
        //그니깐 url 뒤에 abc.com?hello=hi 이런식으로도 보내집니다. 그래서 길이 제한이 있어요   
        let body = {
            limit : Limit,
            skip : Skip
        }
        getProducts(body);
        //원래 모든데이터를 가져왔는데 limit과 skip으로 제한을 둠. 서버에서 이걸 또 처리해야함. 
    }, [])

    const getProducts = (body) => { //공통적인 사용되는 부분이 있어서 이렇게 따로 함수로 만든다. 
        axios.post('/api/product/products', body) 
        .then(response => {
            if(response.data.success) {
                if(body.loadMore) { //더보기 버튼 요청이라면
                    setProducts([...Products, ...response.data.productInfo])
                } else {
                    setProducts(response.data.productInfo); //db에서 가져온 데이터를 state에 저장. 
                }
                setPostSize(response.data.postSize)
            } else {
                alert("상품들을 가져오는데 실패했습니다.")
            }
        })
    }

     //더보기 버튼을 눌렀을 때,
     const loadMoreHandler = () => {
        //여기서 db메소드인 skip과 limit을 사용, 이걸 state로 관리?
        let skip = Skip + Limit;

        let body ={
            limit : Limit,
            skip : skip,
            loadMore : true //더보기버튼을 눌렀을때의 요청이란걸 알려줌. 
        }
        getProducts(body);
        setSkip(skip);
    }

    const renderCards = Products.map((product, index) => {
        return (
        // 반응형으로 만들기 위해 Col, 한줄에 4개의 카드가 오게한다.
        <Col lg={6} md={8} xs={24} key ={index}>
            <Card 
                cover ={<ImageSlider images={product.images} />} //카드내 이미지 슬라이드 만들기(Carousel이용)
            >
                <Meta 
                    title = {product.title}
                    description = {product.description}
                />
            </Card>
        </Col>
        )
    })

    //필터된 정보들 서버로 보낸다. 
    const showFilteredResults = (newFilters) => {
        let body = {
            skip : 0, //0으로 하는 이유는 checkbox를 누를 때마다 다시 처음부터 가져와야 하기 때문이다. 
            limit : Limit,
            filters : newFilters
        }
        getProducts(body);
        setSkip(0);
        //이제 서버로 가서 이 요청과 관련된 부분을 처리해야 한다. 
    }

    //[0,199]이 정보들을 서버로 넘기기 위해.
    const handlePrice = (id) => {  
        const data = Price;
        let array = [];

        for(let key in data) {
            if(data[key]._id === parseInt(id, 10)) {
                array = data[key].array;
            }
        }
        return array;
    }

    const handleFilters = (filters, category) => { //filters안에는 클릭된 id가 담긴 Checked배열이 있다. 
        
        const newFilters = {...Filters};

        if(category === "price") {
            let PriceValues = handlePrice(filters)
            newFilters[category] = PriceValues
        } else {
            newFilters[category] = filters;
        }
        showFilteredResults(newFilters);
        setFilters(newFilters);
    }
   
    return ( //데이터베이스에서 가져온 데이터를 페이지에 렌더
        <div style={{ width : '75%' , margin : '3rem auto'}}>

            <div style={{textAlign : 'center'}}>
                <h2>여행가보자 <Icon type="rocket" /></h2>
            </div>

            {/* filter */}
            {/* UI를 반반 만들어주기 위한 Row사용! */}
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                                                             {/* 자식에서 filters를 가져와서 이 함수로 넘겨줌. */}
                  <CheckBox list={Continents} handleFilters={filters => handleFilters(filters, "continents")} />      
                </Col>
                <Col lg={12} xs={24}>
                    <RadioBox list={Price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
            </Row>


            {/* search */}

            {/* cards => 여기에 카드를 넣을껀데 그 카드를 유동적으로 관리하기 위해 useState로 배열설정*/}
            {/* 카드사이에 여백주기 gutter */}
            <Row gutter={[16, 16]}> 
              {renderCards}
            </Row>

            {/* 더보기 버튼 조건부 설정 */}
            {PostSize >= Limit && 
                <div style={{display : 'flex', justifyContent: 'center'}}>
                  <button onClick={loadMoreHandler}>더보기</button>
                </div>
            }

        </div>
        
    )
}

export default LandingPage
