import axios from 'axios';

const github = axios.create({
  baseURL: 'https://api.github.com/',
});

export default github;
