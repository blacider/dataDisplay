function showLoading(){
	$(".modal-fog").css({
	    visibility:"visible",
	    opacity:0.3
	});
	$(".loading").css("display","block");
}

function hideLoading(){
	$(".modal-fog").css({
	    visibility:"hidden",
	    opacity:0
	});
	$(".loading").css("display","none");
}