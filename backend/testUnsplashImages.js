import axios from 'axios';

const images = [
  'https://images.unsplash.com/photo-1605100804763-247f67b2557e',
  'https://images.unsplash.com/photo-1603561591411-07134e71a2a9',
  'https://images.unsplash.com/photo-1543294001-f7cbfe92237e',
  'https://images.unsplash.com/photo-1598560917505-59a3ad559071',
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
  'https://images.unsplash.com/photo-1635767798638-3e25273a8236',
  'https://images.unsplash.com/photo-1630019852942-f89202989a59',
  'https://images.unsplash.com/photo-1596944229400-2e57ca967462',
  'https://images.unsplash.com/photo-1588444839799-eaa4344ebd19',
  'https://images.unsplash.com/photo-1615655404746-8f030dbbca27',
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1',
  'https://images.unsplash.com/photo-1611085583191-a3b1a30a5a40',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
  'https://images.unsplash.com/photo-1602752275313-477eaabc497c',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0',
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed',
  'https://images.unsplash.com/photo-1611956551065-ec7c7d42cf38'
];

const checkAll = async () => {
  for (let i = 0; i < images.length; i++) {
    const url = `${images[i]}?w=100&auto=format&fit=crop&q=80`;
    try {
      const res = await axios.head(url);
      console.log(`[OK] ${i}: ${images[i]} -> Status ${res.status}`);
    } catch (err) {
      console.log(`[ERR] ${i}: ${images[i]} -> ${err.message}`);
    }
  }
};

checkAll();
