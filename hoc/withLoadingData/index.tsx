// @ts-nocheck
import React, {ReactElement, useEffect, useState} from "react";
import Router from "next/router";
import SliderContainer from "../../src/components/Layout/SliderContainer";
import Login from "../../src/components/Forms/Login";
import {useSelector} from "react-redux";
import AuthPage from "../../pages/login";
import {useRouter} from "next/router";
import {Spin} from "antd";


/**
 *
 * @param data {any} - данные, загрузки которого ждет компонент
 * @param children {JSX}
 * @constructor данных hoc не будет выводить компонент, пока не загрузится data
 */
const WithLoadingData = ({data, children}) => {


    if (!data) {
        return <Spin style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'}}/>
    }

    return children
}

export default WithLoadingData