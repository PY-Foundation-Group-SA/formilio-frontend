import axios from 'axios';

export const requestForm = (fid) => {
    return new Promise((resolve, reject) => {
        try {
            axios.get('https://formilio-backend.herokuapp.com/requestForm', {
                params: {
                    fid: fid
                },
            })
            .then((resp) => {
                console.log(resp.data.form);
                resolve({
                    form: resp.data.form,
                    formName: resp.data.formName,
                    description: resp.data.description
                });
            })
            .catch((err) => {
                console.log(err);
                reject();
            })
        } catch (err) {

        }
    })
}

export const formResponse = (fid, responseFields, token) => {
    return new Promise((resolve, reject) => {
        axios.post('https://formilio-backend.herokuapp.com/addResponse', {
                fid,
                responseFields,
                token,
            })
            .then((resp) => {
                resolve(resp.data);
            })
            .catch((err) => {
                reject();
            })
    })
};
