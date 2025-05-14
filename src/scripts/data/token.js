const Token = {
    get() {
      return localStorage.getItem('token');
    },
    set(token) {
      localStorage.setItem('token', token);
    },
    remove() {
      localStorage.removeItem('token');
    }
  };

  const token = Token.get();
  console.log('Token:', token); 
  
  
export default Token;
  