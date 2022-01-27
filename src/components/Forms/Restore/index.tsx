// @ts-nocheck
import { Form, Input, Button, Checkbox } from 'antd';
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import "antd/dist/antd.css";
import axios from "axios";
import {
    clearAuth, clearAuthError,
    postRegistration,
    postRestoreStepCode,
    postRestoreStepEmail,
    postRestoreStepPassword,
} from "../../../../store/actions/auth";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

interface IRestoreDataEmail {
    email: string,
}

interface IRestoreDataCode {
    code: string,
}

interface IRestoreDataPassword {
    password: string,
    passwordConf: string,
}

const initialStateEmail = {
    email: '',
}

const initialStateCode = {
    code: '' ,
}

const initialStatePassword = {
    password: '',
    passwordConf: '',
}

enum EnumForms {
    EMAIL ,
    CODE ,
    PASSWORD
}

const EmailForm = ({auth}: any) => {

    const [userData, setUserData] = useState<IRestoreDataEmail>(initialStateEmail)
    const dispatch = useDispatch();

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    const [form] = Form.useForm();

    useEffect(() => {
        if (fieldError) {
            form.validateFields(["email"])
        }
    }, [fieldError])

    const validateEmail = (rule: any, value: any, callback: any) => {
        if (fieldError === 'email') {
            callback(errorMessage);
            dispatch(clearAuth())
        } else {
            callback();
        }
    };

    const onSubmit = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(postRestoreStepEmail(userData))
                } catch (e) {
                    console.log(e, 'registration error')
                }
            })
            .catch(async (err) => console.log(err))
    }

    return <Form
        style={{ padding: '0 50px', marginTop: 64 }}
        form={form}
        name="restore"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: true }}
        onSubmitCapture={onSubmit}
        validateTrigger={'onSubmit'}
        autoComplete="off"
    >
        <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }, {type: 'email',  message: 'Please enter a valid email!'}, {validator: validateEmail}]}
        >
            <Input name="email" onChange={onUpdateData}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const CodeForm = ({auth}: any) => {

    const [userData, setUserData] = useState<IRestoreDataCode>(initialStateCode)
    const dispatch = useDispatch();

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const fieldError = auth?.error?.response?.data?.message
    const errorMessage = auth?.error?.response?.data?.error

    const [form] = Form.useForm();

    useEffect(() => {
        if (fieldError) {
            form.validateFields(["code"])
        }
    }, [auth])

    const validateCode = (rule: any, value: any, callback: any) => {
        if (fieldError === 'code') {
            callback(errorMessage);
            dispatch(clearAuthError())
        } else {
            callback();
        }
    };


    const onSubmit = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(postRestoreStepCode({...userData, email: auth.data.email}))
                } catch (e) {
                    console.log(e, 'registration error: Code step')
                }
            })
            .catch(async (err) => console.log(err))
    }
    return <Form
        style={{ padding: '0 50px', marginTop: 64 }}
        name="restore"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: true }}
        onSubmitCapture={onSubmit}
        validateTrigger={'onSubmit'}
        autoComplete="off"
    >
        <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: 'Please input your code!' }, { min: 8, max: 8, message: 'The code must be 8 digits!' }, {validator: validateCode}]}
        >
            <Input name="code" onChange={onUpdateData}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const PasswordForm = ({auth}: any) => {

    const [userData, setUserData] = useState<IRestoreDataPassword>(initialStatePassword)
    const router = useRouter();
    const goStartPage = () => {
        router.push('/')
    }

    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const onUpdateData = (e: any) => {
        const value = e.target.value
        const field = e.target.name
        setUserData({
            ...userData,
            [field]: value,
        })
    }

    const onSubmit = async () => {
        await form.validateFields()
            .then(async (res) => {
                try {
                    await dispatch(postRestoreStepPassword({password: userData.password, email: auth.data.email}, goStartPage))
                } catch (e) {
                    console.log(e, 'registration error: Code step')
                }
            })
            .catch(async (err) => console.log(err))
    }

    const validatePassword = (rule: any, value: any, callback: any) => {
        if (userData.passwordConf !== userData.password) {
            callback("Passwords do not match");
        } else {
            callback();
        }
    };

    return <Form
        style={{ padding: '0 50px', marginTop: 64 }}
        name="restore"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        initialValues={{ remember: true }}
        validateTrigger={'onSubmit'}
        onSubmitCapture={onSubmit}
        autoComplete="off"
    >
        <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password!' }]}
        >
            <Input.Password name="password" onChange={onUpdateData}/>
        </Form.Item>
        <Form.Item
            label="Confirm password"
            name="passwordConf"
            rules={[{ required: true, message: 'Please confirm password!' }, { validator: validatePassword }]}
        >
            <Input.Password name="passwordConf" onChange={onUpdateData}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 12 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}

const Restore = () => {

    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        if (auth.data.resetEnabled) {
            setForm(EnumForms.PASSWORD)
        } else if (auth.data.email) {
            setForm(EnumForms.CODE)
        } else if (auth.data.token) {
            setForm(EnumForms.EMAIL)
        } else setForm(EnumForms.EMAIL)
    }, [auth])

    const [form, setForm] = useState<EnumForms>(EnumForms.EMAIL)

    switch (form) {
        case EnumForms.EMAIL: return <EmailForm auth={auth}/>
        case EnumForms.CODE: return <CodeForm auth={auth}/>
        case EnumForms.PASSWORD: return <PasswordForm auth={auth}/>
        default: return <EmailForm auth={auth}/>
    }
};

export default Restore