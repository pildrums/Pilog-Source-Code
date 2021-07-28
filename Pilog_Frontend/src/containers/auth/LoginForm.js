import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { changeField, initializeForm, login } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import {check} from '../../modules/user';

const LoginForm = ({history}) => {
    const [error, setError] = React.useState(null);
    const dispatch = useDispatch();
    const {form, auth, authError, user} = useSelector(({auth, user}) => ({
        form: auth.login,
        auth: auth.auth,
        authError: auth.authError,
        user: user.user
    }));

    //인풋 변경 이벤트 핸들러
    const onChange = e => {
        const {value, name} = e.target;
        dispatch(
            changeField({
                form: 'login',
                key: name,
                value
            })
        );
    };

    //폼 등록 이벤트 핸들러
    const onSubmit = e => {
        e.preventDefault();
        const {username, password} = form;
        dispatch(login({username, password}));
    };

    //컴포넌트가 처음 렌더링될 때 form을 초기화함
    React.useEffect(() => {
        dispatch(initializeForm('login'));
    }, [dispatch]);

    React.useEffect(() => {
        if(authError){
            console.log('오류 발생');
            console.log(authError);
            setError('로그인 실패');
            return;
        }
        if(auth){
            console.log('로그인 성공');
            dispatch(check());
        }
    }, [auth, authError, dispatch]);

    React.useEffect(() => {
        if(user){
            history.push('/');
            try{
                localStorage.setItem('user', JSON.stringify(user));
            }catch(e){
                console.log('localStorage is not working');
            }
        }
    }, [history, user]);

    return (
        <AuthForm
            type="login"
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error}
        />
    );
};

export default withRouter(LoginForm);