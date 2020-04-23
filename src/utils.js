import axios from 'axios';

export const requestForm = (formName) => {
    return new Promise((resolve, reject) => {
        try {
            axios.get('https://formilio-backend.herokuapp.com/requestForm', {
                params: {
                    formName: formName
                },
            })
            .then((resp) => {
                console.log(resp.data.form);
                resolve(resp.data.form);
            })
            .catch((err) => {
                console.log(err);
                reject();
            })
        } catch (err) {

        }
    })
}

export const formResponse = (formName, responseFields) => {
    return new Promise((resolve, reject) => {
        try {
            axios.post('https://formilio-backend.herokuapp.com/addResponse', {
                formName,
                responseFields,
            })
            .then((resp) => {
                console.log(resp.data.form);
                resolve(resp.data.form);
            })
            .catch((err) => {
                console.log(err);
                reject();
            })
        } catch (err) {
            console.log(err);
            reject();
        }
    })
};
