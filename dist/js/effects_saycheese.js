$(document).ready(function() {
	var scanner = new SayCheese('#example', {audio: false});

	scanner.on('error', function(error) {
		$('#example').html('<p>Your browser does not support this plugin.</p>');
	});

	scanner.on('snapshot', function(snapshot) {
		qrCodeDecoder(snapshot.toDataURL());
	});
	
	qrcode.callback = showInfo;

	scanner.on('success', function() {
		scanCode(scanner);
	});

	scanner.start();
});

// recursive function for scanning code
function scanCode(scanner) {
	scanner.takeSnapshot();	
	setTimeout(function() {
		scanCode(scanner);
	}, 1000);
}

// decode the img
function qrCodeDecoder(dataUrl) {
	qrcode.decode(dataUrl);
}

// show info from first qr code. format: id, name, price, [definition1, definition2, definition3, definition4, etc...]
var total = 0
function calcPrice(add, sub){
	total=total+add-sub;
	$('.total').html(total)
	console.log(total)
}
var purchased = null
var purchases = document.getElementById("purchase");
function purchaseSummary(added, price){
	anItem = document.createElement('p')
	anItemPrice = document.createElement('p')
	$(anItem).attr("class", "col-xs-6")
	$(anItemPrice).attr("class", "col-xs-6 text-right")
	$(anItem).html(added)
	$(anItemPrice).html(price)
	purchases.appendChild(anItem)
	purchases.appendChild(anItemPrice)
	console.log(added, price)
}
function showInfo(data) {
	if (data !== 'error decoding QR Code') {
		var htmldata = data.split('[');
		p2 = htmldata[1].split(', ')
		p1 = htmldata[0].split(', ')
		id = p1[0];
		name = p1[1];
		price = p1[2]
		definitionsSum = p2.length;
		definitions = []
		for (var i = 0; i < p2.length; i++) {
			if (i!=p2.length-1) {
				definitions.push(p2[i])
				
			}
			else {
				var thelast = p2[i].substring(0, p2[i].length-1)
				definitions.push(thelast)
			}
		};
		$("#qrContent p").html("Success");
		$("#qrContent").removeClass("alert-info");
		$("#qrContent").addClass("alert-success");
		$("#inputItem").val(name + ' ' + '[' + id + '] ' + price);
		$('#myModal').modal('hide');
		calcPrice(parseFloat(price), parseFloat(0))
		purchaseSummary(name, price)
		addFields(definitionsSum, definitions);
	}
}

// show info from other qr codes. format: id, name, price
function anotherInfo(data) {
	if (data !== 'error decoding QR Code') {
		var htmldata = data.split(', ')
		name = htmldata[0]
		price = htmldata[1]
		$("#qrContent p").html("Success");
		$("#qrContent").removeClass("alert-info");
		$("#qrContent").addClass("alert-success");
		$('#myModal').modal().hasClass('class')
		var currentId = "#" + $('#myModal').modal().children().children().children().children(".modal-title").html()
		$(currentId).val(name + " " + price);
		$('#myModal').modal('hide');
		calcPrice(parseFloat(price), parseFloat(0))
		purchaseSummary(name, price)
	}
}

















$('#myModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget)
	var recipient = button.data('fill')
	var modal = $(this)
	$("#qrContent p").html("No QR code in sight.");
	$("#qrContent").addClass("alert-info");
	$("#qrContent").removeClass("alert-success");
	modal.find('.modal-title').text(recipient)
	modal.addClass(recipient)
	modal.addClass("modal")
	modal.addClass("fade")
	if (recipient == "Item") {
		qrcode.callback = showInfo
	}
	else{
		qrcode.callback = anotherInfo
	}
})
$('#myModal').on('hide.bs.modal', function (event) {
	jQuery('div.row div.modal').attr('class', 'modal fade');
	qrcode.callback = null;
})
function removeEverything(){
	$('.itemChild').remove();
	$('#inputItem').val('');
}

function addFields(n,m){
	var number = n;
	var defs = m;
	var container = document.getElementById("definitions");
	while (container.hasChildNodes()) {
		container.removeChild(container.lastChild);
	}
	for (i=0;i<number;i++){
		var inputItem = m[i];
		var fGroup = document.createElement("div");
		var lbl = document.createElement("label");
		var iGroup = document.createElement("div");
		var input = document.createElement("input");
		var label = document.createElement("label");
		var iGroupBtn = document.createElement("div");
		var successButton = document.createElement("button")
		var successButtonIcon = document.createElement("i");
		var cancelButton = document.createElement("button")
		var cancelButtonIcon = document.createElement("i");

		$(fGroup).addClass("form-group itemChild");

		$(lbl).attr("for", inputItem);

		$(iGroup).addClass("input-group");

		$(label).html(inputItem);

		$(input).attr("disabled", "");
		$(input).attr("id", inputItem);
		$(input).attr("placeholder", inputItem);
		$(input).addClass("form-control");
		input.type = "text";
		input.name = inputItem;

		$(iGroupBtn).addClass("input-group-btn");

		$(successButton).addClass("btn");
		$(successButton).addClass("btn-success");
		$(successButton).attr("data-toggle", "modal");
		$(successButton).attr("data-target", "#myModal");
		$(successButton).attr("data-fill", inputItem);
		$(successButton).attr("id", inputItem);
		$(successButtonIcon).addClass("fa");
		$(successButtonIcon).addClass("fa-qrcode");
		successButton.type = "button"

		$(cancelButton).addClass("btn");
		$(cancelButton).addClass("btn-danger");
		$(cancelButtonIcon).addClass("fa");
		$(cancelButtonIcon).addClass("fa-remove");

		fGroup.appendChild(lbl);
		successButton.appendChild(successButtonIcon);
		iGroupBtn.appendChild(successButton);
		cancelButton.appendChild(cancelButtonIcon);
		iGroupBtn.appendChild(cancelButton);
		fGroup.appendChild(label);
		iGroup.appendChild(input);
		iGroup.appendChild(iGroupBtn);
		fGroup.appendChild(iGroup);
		container.appendChild(fGroup);
	}
}
function submitform()
{
	 $(".calc").print({
            globalStyles: true,
            mediaPrint: false,
            stylesheet: "dist/css/custom.css",
            noPrintSelector: ".no-print",
            iframe: true,
            append: null,
            prepend: null,
            manuallyCopyFormValues: true,
            deferred: $.Deferred(),
            timeout: 100
    });
}