(function() {

var f = {};

var data = {
	candidates: [
		{
			name: "Kevin DeWine",
			id: 'DEWINE',
			data: '',
		},
		{
			name: "Jon Husted",
			id: 'HUSTED',
			data: '',
		},
		{
			name: "John Kasich",
			id: 'KASICH',
			data: '',
		},
	],
	months: [
		{id:"0",name:"Jan"},
		{id:"1",name:"Feb"},
		{id:"2",name:"Mar"},
		{id:"3",name:"Apr"},
		{id:"4",name:"May"},
		{id:"5",name:"Jun"},
		{id:"6",name:"Jul"},
		{id:"7",name:"Aug"},
		{id:"8",name:"Sep"},
		{id:"9",name:"Oct"},
		{id:"10",name:"Nov"},
		{id:"11",name:"Dec"}
	],
	offices: [
		{"office":"ATTORNEY GENERAL","id":1},
		{"office":"AUDITOR","id":4},
		{"office":"COURT OF APPEALS JUDGE","id":18},
		{"office":"GOVERNOR","id":7},
		{"office":"HOUSE","id":8},
		{"office":"POLICE AND FIRE PENSION FUND","id":16},
		{"office":"PUBLIC EMPLOYEES RETIREMENT","id":13},
		{"office":"SCHOOL EMPLOYEES RETIREMENT","id":14},
		{"office":"SECRETARY OF STATE","id":10},
		{"office":"SENATE","id":5},
		{"office":"STATE BOARD OF EDUCATION","id":2},
		{"office":"STATE HWY PATROL RETIREMENT","id":17},
		{"office":"STATE TEACHERS RETIREMENT","id":15},
		{"office":"SUPREME COURT CHIEF JUSTICE","id":3},
		{"office":"SUPREME COURT JUSTICE","id":9},
		{"office":"TREASURER","id":11},
		{"office":"UNDECLARED","id":12}
	],
}

f.get_candidates_for_office = function(office) {
	$.get('https://cfapidev.sos.state.oh.us:8443/ords/cfinance/cac/fullCont/OFF:'+office)
	.then(function(result) {
		data.governor_candidates = result;
	});
}

f.get_records_for_candidate = function(candidate) {
	$.get('https://cfapidev.sos.state.oh.us:8443/ords/cfinance/cac/fullCont/CALAST:'+candidate)
	.then(function(result) {
		for (i in data.candidates) {
			if (candidate == data.candidates[i].id) {
				console.log(result);
				data.candidates[i].data = result;
			}
		}
	});
}

f.get_contributions_for_candidates = function() {
	for (i in data.candidates) {
		f.get_records_for_candidate(data.candidates[i].id);
	}
}

f.output_latest_contributions_tables = function() {
	var data_check = data.candidates.every(function(element,index,array) {
		return element.data!='';
	});
	if (data_check) {
		var return_html = '';
		for (i in data.candidates) {

			var office = data.candidates[i].data.items[0].office_code;
			for (o in data.offices) {
				if (office == data.offices[o].id) {
					office = data.offices[o].office;
				}
			}

			var candidate_block = '<div class="candidate">';
				candidate_block += '<h3>'+data.candidates[i].name+', '+office+'</h3>';
				candidate_block += '<table class="table table-striped">';
					candidate_block += '<thead>';
						candidate_block += '<tr>';
							candidate_block += '<th>Contributor</th>';
							candidate_block += '<th>Amount</th>';
							candidate_block += '<th>Contributor city</th>';
							candidate_block += '<th>Report Date</th>';
						candidate_block += '</tr>';
					candidate_block += '</thead>';
					candidate_block += '<tbody>';
						for (r in data.candidates[i].data.items) {
							//THIS CONTRIBUTION
							var c = data.candidates[i].data.items[r];
							//FORMAT THE DATE
							var date = new Date(c.report_filing_date);
							var month = date.getMonth();
							for (m in data.months) {
								if (data.months[m].id == month) {
									month = data.months[m].name;
								}
							}
							var day = date.getUTCDate();
							var year = date.getFullYear();
							candidate_block += '<tr>';
								candidate_block += '<td>'+c.contributor_name+'</td>';
								candidate_block += '<td>$'+c.amount.toLocaleString()+'</td>';
								candidate_block += '<td>'+c.contributor_city+', '+c.contributor_state+'</td>';
								candidate_block += '<td>'+month+' '+day+', '+year+'</td>';
							candidate_block += '</tr>';
						}
					candidate_block += '</tbody>';
				candidate_block += '</table>';
			candidate_block += '</div>';
			return_html += candidate_block;
		}
		$("#candidate_tables").html(return_html);
	} else {
		setTimeout(function() {
			f.output_latest_contributions_tables();
		}, 300);
	}

}

f.initial_load = function() {
	f.get_contributions_for_candidates();
	f.output_latest_contributions_tables();
}

f.initial_load();

})();