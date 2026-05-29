import axios from 'axios';

const url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80&sig=40';
const check = async () => {
  try {
    const res = await axios.head(url);
    console.log("Status:", res.status);
  } catch (err) {
    console.log("Err:", err.message);
  }
};
check();
