@app.route('/', methods=['GET', 'POST'])
def main():
    if flask.request.method == 'GET':
        return(flask.render_template('main.html'))    
    if flask.request.method == 'POST':        
    	starrating = flask.request.form['starrating']
	    swimming = flask.request.form['swimming']
	    tourist = flask.request.form['tourist'] 
	    holiday = flask.request.form['holiday']
	    breakfast = flask.request.form['breakfast']
	   	input_variables = pd.DataFrame([[starrating, swimming, tourist, holiday, breakfast]],
	   		columns=['temperature', 'swimming', 'tourist', 'holiday','breakfast'],dtype=float)
	   	prediction = model.predict(input_variables)[0]        
   		return flask.render_template('main.html',
   			original_input={'temperature':temperature, 'swimming':swimming , 'tourist':tourist, 'holiday':holiday,'breakfast':breakfast},
   			result=prediction)