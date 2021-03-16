$('#hotel-search').on('input', function() {
    var search = $(this).serialize();
    if(search === "search=") {
      search = "all"
    }
    $.get('/hotels?' + search, function(data) {
        $('#hotel-grid').html('');
        data.forEach(function(hotel) {
            $('#hotel-grid').append(`
                <div class="col-md-3 col-sm-6">
                <div class="boxed">
                   <img height="173.5" width="260.5" src="${ hotel.image }">
                   <div class="caption">
                       <a><h4>${ hotel.name }</h4></a>
                   </div>
                   <strong>Star Rating : ${ hotel.starrating } </strong><span class="fa fa-star checked"></span>
                   <br>
                   <strong>User Rating : ${ hotel.userrating } <span class="fa fa-star checked"></span></strong>
                   <p>
                       <a href="/hotels/${ hotel._id }" class="btn btn-primary">More Info</a>
                   </p>
                </div>
            </div>
            `);
        });
    });
});

$('#hotel-search').submit(function(event) {
    event.preventDefault();
});