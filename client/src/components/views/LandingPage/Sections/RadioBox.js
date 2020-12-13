import React, {useState} from 'react';
import { Collapse, Radio } from 'antd';
const { Panel } = Collapse;


function RadioBox(props) {

    const [Value, setValue] = useState(0) //Value가 price객체의 _id이기 때문에 초기 state로 0을 준다. 

    const RenderRadioBoxLists = () => props.list && props.list.map((price) => {
        return (
            <Radio key={price._id} value={price._id} >
              {price.name} 
            </Radio> 
        )
    })

    const handleOnChange = (e) => {
        setValue(e.target.value);
        props.handleFilters(e.target.value);
    }


    return (
        <Collapse defaultActiveKey={['1']} >
            <Panel header="가격 필터" key="1">
                {/* 라디오는 하나만 눌리게 하기 위해 antdesign에서 group코드를 가져옴 */}
                 <Radio.Group onChange={handleOnChange} value={Value}> 
                      {RenderRadioBoxLists()}
                 </Radio.Group>
            </Panel>
        </Collapse> 
    )
}

export default RadioBox;