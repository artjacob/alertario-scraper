var http = require("http");
var request = require("request");
var cheerio = require("cheerio");
var moment = require("moment");

function formatNumber(number) {
	return parseFloat(number.replace(",", "."));
}

var server = http.createServer(function(req, res) {
	res.writeHead(200, { "content-type": "application/json" });

	var chuva = [ ];
	request({ "uri": "http://alertario.rio.rj.gov.br/upload/TempoReal.html" }, function(error, response, body) {
		var $ = cheerio.load(body);

		$("table tbody tr").each(function() {
			var $this = $(this);
			var estacao = {
				"estacao": $this.find("td:nth-of-type(2)").text(),
				"hora-da-leitura": moment($this.find("td:nth-of-type(3)").text(), "hh:mm").format(),
				"15-minutos": formatNumber($this.find("td:nth-of-type(4)").text()),
				"1-hora": formatNumber($this.find("td:nth-of-type(5)").text()),
				"4-horas": formatNumber($this.find("td:nth-of-type(6)").text()),
				"24-horas": formatNumber($this.find("td:nth-of-type(7)").text()),
				"96-horas": formatNumber($this.find("td:nth-of-type(8)").text()),
				"mes": formatNumber($this.find("td:nth-of-type(9)").text())
			};

			chuva.push(estacao);
		});

		res.end(JSON.stringify(chuva));
	});
});

server.listen(8080);
