import React,{useState} from 'react';
import { Collapse, Checkbox } from 'antd';
const { Panel } = Collapse;

function CheckBox(props) {

    const [Checked, setChecked] = useState([])
 
    const handleToggle = (id) => {
        //누른 것의 index를 구한다. 
        //Checked배열에는 [1,2,3] 이런식임. 
        const currentIndex = Checked.indexOf(id);

        let newChecked = [...Checked];
        if(currentIndex === -1) { //check
            newChecked.push(id);
        } else {//uncheck
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked); 
        //이제 filter된거 렌더링 해야쥐!
        props.handleFilters(newChecked);
    }

    const renderCheckBoxLists = () => props.list && props.list.map((continent, index) => {
        return (
            <React.Fragment key={index} >
              <Checkbox onChange={() => handleToggle(continent._id)} 
              checked={Checked.indexOf(continent._id) === -1? false : true}  />
              <span>{continent.name}</span>
            </React.Fragment>
        )
    })

    return (
        // ant design에서 collapse, checkbox 이용.
        <div> 
            <Collapse defaultActiveKey={['1']} >
                <Panel header="대륙 필터" key="1">
                    {renderCheckBoxLists()}
                </Panel>
            </Collapse>  
        </div>
    )

}

export default CheckBox;