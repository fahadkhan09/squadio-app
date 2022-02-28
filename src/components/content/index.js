/*eslint no-undef: 1*/
import './style.css';
import { countries } from "../../utils/constant/countriesList";
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { dummyData } from './dummyData';


const ContentArea = (props) => {
    const { selectUser } = props;
    const [map, setMap] = useState(null)
    const [inputValue, setInputValue] = useState('')
    const [items, setItems] = useState([])
    const [selection, setSelection] = useState('')
    const [showPopup, setShowPopup] = useState(true)
    const [country, setCountry] = useState({})
    const [lang, setLang] = useState('')
    const [long, setLong] = useState('')
    const [updateBtn, setUpdateBtn] = useState(false)
    const [updateID, setUpdateID] = useState(null)

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('items'));
        if(localData?.length > 0){
            setItems(localData?.find((item) => item.user == selectUser).data)
            getValues(localData?.find((item) => item.user == selectUser).data[0])
        } else{
            setItems(dummyData.find((item) => item.user == selectUser).data)
            localStorage.setItem("items", JSON.stringify(dummyData))
            getValues(dummyData?.find((item) => item.user == selectUser).data[0])

        }
    }, [selectUser])

    useEffect(() => {
        let localData = JSON.parse(localStorage.getItem('items'));
        if(localData.length > 0){
           const selectedIndex =  localData?.findIndex((item) => item.user == selectUser)
           localData[selectedIndex].data = items
           localStorage.setItem("items", JSON.stringify(localData))
        }
    }, [items])

    useEffect(() => {
        if (!showPopup) {
            initializeMap()
        }
    }, [])

    useEffect(() => {
        if (!showPopup) {
            if (map) {
              updateMap()
            } else {
              initializeMap()
            }
        }
    }, [country])

    const updateMap = () => {
        if (map) {
            map.setView([lang, long], 5);
            L.popup()
                .setLatLng([lang, long])
                .setContent(`${inputValue} is located in ${country.name}`)
                .openOn(map);
        }
    }
    const initializeMap = () => {

        var mapElement = new L.map('map').setView([lang, long], 5);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoicHlzb2Z0ZGV2IiwiYSI6ImNsMDM5dW15ZTFieWIza3Foanh1NDN6cncifQ.yvLJzR4Sy0MH3kqnnnHN9Q'
        }).addTo(mapElement);
        L.popup()
            .setLatLng([lang, long])
            .setContent(`${inputValue} is located in ${country.name}`)
            .openOn(mapElement);
        setMap(mapElement)
    }

    const showRightBox = () => {
        setInputValue('')
        setCountry('')
        setShowPopup(true)
    }
    const getValues = (value) => {

        const selectedCounttry = countries.find(e => e.id == value?.country)
        if (selectedCounttry) {
            setShowPopup(false)
            setInputValue(value.name)
            setLang(selectedCounttry.position[0])
            setLong(selectedCounttry.position[1])
            setCountry({ ...selectedCounttry, building: value.name })
        }
    }

    const updateItems = (id) => {
        setUpdateID(id)
        setUpdateBtn(true)
        setShowPopup(true)
        const selectedItem = items[id]
        if (selectedItem) {
            setInputValue(selectedItem?.name)
            const selectedCounttry = countries.find(e => e.id == selectedItem?.country)
            if (selectedCounttry) {
                setSelection(selectedCounttry.id)
                setCountry({ ...selectedItem, building: selectedCounttry.name })
            }
        }
    }
    const deleteItems = (id) => {
        setUpdateID(id)
        items.splice(id, 1)
        setInputValue('')
        setItems([...items])
    }

    const Sidebar = (heading, itemList) => {
        return (
            <div className='sidebar'>
                <p className='heading'> {heading}</p>
                <div className='list-item'>
                    {itemList && itemList.length ? itemList.map((item, key) => {
                        return (
                            <div className='name' key={key}> <p onClick={() => getValues(item)} key={key}>{item.name}</p>
                                <div className='action'>
                                    <img onClick={() => updateItems(key)} className='icon' src="/images/pen-to-square-solid.svg" alt="image" />
                                    <img onClick={() => deleteItems(key)} className='icon' src="/images/trash-can-solid.svg" alt="image" />
                                </div>
                            </div>
                        )
                    }) : ''}
                </div>
                <button className='bottomBtn' onClick={showRightBox}>Add Building</button>

            </div>
        )
    }

    const getValue = (value) => {
        setSelection(value.target.value)
    }
    const getInputValues = () => {
        if (inputValue !== '') {
            setUpdateBtn(false)
            if (updateID) {
                items[updateID].name = inputValue
                items[updateID].country = selection
                setItems([...items])
                setInputValue('');
                setSelection('');
                setUpdateID(null);

            }
            else {
                setItems([...items, { name: inputValue, country: selection }])
                setUpdateID(null)
                setSelection('')
                setInputValue('')
            }
        }

    }

    const addNewBuilding = heading => {
        return (
            <div className='content-area'>               
                
                <div style={showPopup ? { display: 'block' } : { display: 'none' }}>
                    <p className='heading'> {heading}</p>
                    <p className='form-item'>
                        <label>Name</label>
                        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                    </p>
                    <p className='form-item'>
                        <label>Location</label>
                        <select className="countryList" onChange={getValue} value={selection}>
                            {countries.map((item, key) => {
                                return (
                                    <option key={key} value={item.id}> {item.name}</option>
                                )
                            })}
                        </select>
                    </p>
                </div>
                <div style={!showPopup ? { display: 'block' } : { display: 'none' }}>
               
                    <div id='map' ref={map} style={{ height: '500px' }} />
                </div>

                <div style={showPopup ? { display: 'flex' } : { display: 'none' }} className='content-footer'>
                    <button className='buttonCancel' onClick={() => setShowPopup(false)}>Cancel</button>
                    {updateBtn ? <button className='buttonUpdate' onClick={getInputValues}>Update</button> : <button className='buttonUpdate' onClick={getInputValues}>Create</button>
                    }
                </div>
            </div>
        )
    }


    return (
        <div className="layout">
            {Sidebar('Building', items)}
            {addNewBuilding('Update')}
        </div>
    );
}

export default ContentArea;
