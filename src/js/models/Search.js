import axios from 'axios';

export default class Serarch {
    constructor(query) {
        this.query = query;
    }

    async getForkify() {
        try {
            const res = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}