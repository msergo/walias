import axios from 'axios';
import config from 'config';

const wildDuckClient = axios.create({
    baseURL: config.get('wildDuck.url'),
    headers: {
        'X-Access-Token': config.get('wildDuck.token'),
    },
    responseType: 'json',
});

export default wildDuckClient;
