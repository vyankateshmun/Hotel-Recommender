import flask
import joblib
import pandas as pd
from joblib import load
app = flask.Flask(__name__)
model = load("hotel_prices.joblib")
@app.route('/', methods=['GET', 'POST'])
def main():
    if flask.request.method == 'GET':
        return(flask.render_template('main.html'))    
    if flask.request.method == 'POST':
    	starrating = flask.request.form['starrating']
    	capacity = flask.request.form['capacity']
    	city = flask.request.form['city']
    	swimming = flask.request.form['swimming']
    	if swimming=='Yes':
    		swimming=1
    	else:
    		swimming=0
    	holiday = flask.request.form['holiday']
    	if holiday=='Yes':
    		holiday=1
    	else:
    		holiday=0
    	breakfast = flask.request.form['breakfast']
    	if breakfast=='Yes':
    		breakfast=1
    	else:
    		breakfast=0
    	input_variables = pd.DataFrame([[starrating, capacity, city, swimming, holiday, breakfast]],columns=['StarRating', 'HotelCapacity', 'CityRank', 'HasSwimmingPool', 'IsHoliday','FreeBreakfast'],dtype=float)
    	prediction = model.predict(input_variables)[0]
    	return flask.render_template('main.html',original_input={'starrating':starrating, 'capacity':capacity,'city':city,'swimming':swimming , 'holiday':holiday,'breakfast':breakfast},result=prediction)

def main():
    return(flask.render_template('main.html'))
if __name__ == '__main__':
    app.run()