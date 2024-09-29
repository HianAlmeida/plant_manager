import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormData {
    nome?: string;
    sobrenome?: string;
    email?: string;
    username?: string;
    senha?: string;
}

export const handleLoginSubmit = async (formData: FormData) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACK_END_API_URL}/auth/login/`, formData);
        console.log('Login bem-sucedido:', response.data);
        // Redirecionar ou manipular o login bem-sucedido
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        // Aqui você pode mostrar uma mensagem de erro
    }
};

export const handlePasswordResetSubmit = async (formData: FormData) => {
    // Lógica para redefinir senha
    console.log('Redefinindo senha com os dados:', formData);

};

export const handleRegisterSubmit = async (formData: FormData, navigate: ReturnType<typeof useNavigate>) => {
    try {
        console.log(process.env.REACT_APP_BACK_END_API_URL)
        const response = await axios.post(`${process.env.REACT_APP_BACK_END_API_URL}/auth/register/`, formData);
        console.log('Registro bem-sucedido:', response.data);
        // Redirecionar ou manipular registro bem-sucedido
        navigate('/'); // Redireciona para a página inicial
    } catch (error) {
        console.error('Erro ao registrar:', error);
        // Aqui você pode mostrar uma mensagem de erro
    }
};