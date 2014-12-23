var canvas;
var a;
var b;
$(document)
		.ready(
				function() {
					// setup front side canvas
					canvas = new fabric.Canvas('tcanvas', {
						hoverCursor : 'pointer',
						selection : true,
						selectionBorderColor : 'blue'
					});
					canvas.on({
						'object:moving' : function(e) {
							e.target.opacity = 0.5;
						},
						'object:modified' : function(e) {
							e.target.opacity = 1;
						},
						'object:selected' : onObjectSelected,
						'selection:cleared' : onSelectedCleared
					});
					document.getElementById("shirtDiv").style.backgroundColor = "#BF5FFF";

					document.getElementById('add-text').onclick = function() {
						var text = $("#text-string").val();
						var textSample = new fabric.Text(text, {
							left : fabric.util.getRandomInt(0, 200),
							top : fabric.util.getRandomInt(0, 400),
							fontFamily : 'helvetica',
							angle : 0,
							fill : '#000000',
							scaleX : 0.5,
							scaleY : 0.5,
							fontWeight : '',
							hasRotatingPoint : true
						});
						canvas.add(textSample);
						canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
						$("#texteditor").css('display', 'block');
						$("#imageeditor").css('display', 'block');
					};
					$("#text-string").keyup(function() {
						var activeObject = canvas.getActiveObject();
						if (activeObject && activeObject.type === 'text') {
							activeObject.text = this.value;
							canvas.renderAll();
						}
					});
					var imageLoader = document.getElementById('imageLoader');
					imageLoader.addEventListener('change', handleImage, false);

					function handleImage(e) {
						var reader = new FileReader();

						reader.onload = function(event) {
							var img = new Image();
							img.onload = function() {

								var el = e.target;

								var offset = 50;
								var left = fabric.util.getRandomInt(0 + offset,
										200 - offset);
								var top = fabric.util.getRandomInt(0 + offset,
										400 - offset);

								fabric.Image.fromURL(event.target.result,
										function(image) {
											image.set({
												left : left,
												top : top,
												angle : 0,
												padding : 10,
												cornersize : 10,
												hasRotatingPoint : true
											});

											canvas.add(image);
										});
							}
							img.src = event.target.result;
						}
						reader.readAsDataURL(e.target.files[0]);
					}
					document.getElementById('remove-selected').onclick = function() {
						var activeObject = canvas.getActiveObject(), activeGroup = canvas
								.getActiveGroup();
						if (activeObject) {
							canvas.remove(activeObject);
							$("#text-string").val("");
						} else if (activeGroup) {
							var objectsInGroup = activeGroup.getObjects();
							canvas.discardActiveGroup();
							objectsInGroup.forEach(function(object) {
								canvas.remove(object);
							});
						}
					};

					$("#text-bold")
							.click(
									function() {
										var activeObject = canvas
												.getActiveObject();
										if (activeObject
												&& activeObject.type === 'text') {
											activeObject.fontWeight = (activeObject.fontWeight == 'bold' ? ''
													: 'bold');
											canvas.renderAll();
										}
									});
					$("#text-italic")
							.click(
									function() {
										var activeObject = canvas
												.getActiveObject();
										if (activeObject
												&& activeObject.type === 'text') {
											activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? ''
													: 'italic');
											canvas.renderAll();
										}
									});
					$("#font-family").change(function() {
						var activeObject = canvas.getActiveObject();
						if (activeObject && activeObject.type === 'text') {
							activeObject.fontFamily = this.value;
							canvas.renderAll();
						}
					});

					$('.color-preview')
							.click(
									function() {
										var color = $(this).css(
												"background-color");
										document.getElementById("shirtDiv").style.backgroundColor = color;
									});

					$('#flip')
							.click(
									function() {
										if ($(this).attr("data-original-title") == "Show Back View"
												|| typeof $(this).attr(
														"data-original-title") === 'undefined') {
											$(this).attr('data-original-title',
													'Show Front View');
											$("#tshirtFacing").attr("src",
													"img/crew_back.png");
											a = JSON.stringify(canvas);
											canvas.clear();
											try {
												var json = JSON.parse(b);
												canvas.loadFromJSON(b);
											} catch (e) {
											}

										} else {
											$(this).attr('data-original-title',
													'Show Back View');
											$("#tshirtFacing").attr("src",
													"img/crew_front.png");
											b = JSON.stringify(canvas);
											canvas.clear();
											try {
												var json = JSON.parse(a);
												canvas.loadFromJSON(a);
											} catch (e) {
											}
										}
										canvas.renderAll();
										setTimeout(function() {
											canvas.calcOffset();
										}, 200);
									});
				});

function getRandomNum(min, max) {
	return Math.random() * (max - min) + min;
}

function onObjectSelected(e) {
	var selectedObject = e.target;
	$("#text-string").val("");
	selectedObject.hasRotatingPoint = true
	if (selectedObject && selectedObject.type === 'text') {
		// display text editor
		$("#texteditor").css('display', 'block');
		$("#text-string").val(selectedObject.getText());
		$("#imageeditor").css('display', 'block');
	}

	else if (selectedObject && selectedObject.type === 'image') {
		// display image editor
		$("#texteditor").css('display', 'none');
		$("#imageeditor").css('display', 'block');
	}
}

function onSelectedCleared(e) {
	$("#texteditor").css('display', 'none');
	$("#text-string").val("");
	$("#imageeditor").css('display', 'block');
}

function setFont(font) {
	var activeObject = canvas.getActiveObject();
	if (activeObject && activeObject.type === 'text') {
		activeObject.fontFamily = font;
		canvas.renderAll();
	}
}

function removeWhite() {
	var activeObject = canvas.getActiveObject();
	if (activeObject && activeObject.type === 'image') {
		activeObject.filters[2] = new fabric.Image.filters.RemoveWhite({
			hreshold : 100,
			distance : 10
		});// 0-255, 0-255
		activeObject.applyFilters(canvas.renderAll.bind(canvas));
	}
}
function dlCanvas() {
	var tmp_canvas = document.getElementById('tcanvas');
	var dt = tmp_canvas.toDataURL('image/jpg');
	window.location = tmp_canvas.toDataURL("image/png");
	// this.href = dt.replace(/^data:image\/[^;]/,
	// 'data:application/octet-stream');
};

