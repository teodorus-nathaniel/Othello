const OthelloPin = (color) => {
	return `
    <div class="circle ${color}">
      <div class="black"></div>
      <div class="white"></div>
    </div>
  `;
};

export default OthelloPin;
