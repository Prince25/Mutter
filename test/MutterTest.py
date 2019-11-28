import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys


from selenium import webdriver

# mutter test account
test_email = 'masonTest@gmail.com'
wrong_email = '123456'
test_password = 'masonTest'

# Spotify test account
spotify_email = 'rubbish.1208@gmail.com'
spotify_password = 'cs12345678'

browser = webdriver.Chrome()
browser.get('localhost:3000')

time.sleep(2)

# locate the email
elem = browser.find_element_by_id('email')

# send wrong key to email
elem.send_keys(wrong_email)
time.sleep(1)

# locate password
mutter_password = browser.find_element_by_id('password')

# send key to password
mutter_password.send_keys(test_password)

# locate the sign in button and click sign in
signIn_button = browser.find_element_by_id('signin_btn')
signIn_button.click()

time.sleep(2)

# locate the email
elem = browser.find_element_by_id('email')

# send correct key to email
length = len(elem.get_attribute('value'))
elem.send_keys(length * Keys.BACKSPACE)
time.sleep(1)
elem.send_keys(test_email)
time.sleep(1)

# locate the sign in button and click sign in
signIn_button = browser.find_element_by_id('signin_btn')
signIn_button.click()

#####################################################
# Now logged in, at Discover page (without logged in to Spotify)
time.sleep(3)

# # click search when not connect with Spotify
# search_button = browser.find_element_by_id('search_btn')
# # search_button = browser.find_element_by_link_text('SEARCH')
# search_button.click()

# # Expect to show a window says cannot search
# time.sleep(2)
# elem.send_keys(Keys.RETURN);
# time.sleep(1)

# locate and click profile button
profile_button = browser.find_element_by_id('profile_btn')
# profile_button = browser.find_element_by_link_text('')
profile_button.click()

#####################################################
# Now the browser is at Profile page, click login to spotify
time.sleep(2)
login_spotify = browser.find_element_by_id('spotify')
login_spotify.click()

######################################################
# Now the browser is at server login page, click login with spotify
time.sleep(4)
spotify_button = browser.find_element_by_id('logInSpotify')
spotify_button.click()

############################################################
# Now the browser is at spotify's log in page, locate account and password
time.sleep(2)
spotify_user = browser.find_element_by_id('login-username')
password_box = browser.find_element_by_id('login-password')
login_button = browser.find_element_by_id('login-button')
spotify_user.send_keys(spotify_email)
time.sleep(0.3)
password_box.send_keys(spotify_password)
login_button.click()

##################################################
# logged in to spotify
# Now at Discover Page with logged in state

time.sleep(2)
# click search
search_button = browser.find_element_by_id('search_btn')
# search_button = browser.find_element_by_link_text('SEARCH')
search_button.click()

##################################
time.sleep(2)
# find search box and enter keyword
search_box = browser.find_element_by_id('searchartists_input')
search_string = 'Taylor Swift'
for char in search_string:
	search_box.send_keys(char)
	time.sleep(0.3)



# switch search option from artist to track
searchOption_artist = browser.find_element_by_id('artist_span')
searchOption_album = browser.find_element_by_id('album_span')
searchOption_track = browser.find_element_by_id('track_span')
# searchOption_track = browser.find_element_by_css_selector("input[type='radio'][value='Track']")
time.sleep(2)
searchOption_track.click()

# print "clicked"

# post about the first song
time.sleep(1.5)
post_btn1 = browser.find_element_by_id('PostSong_1')
post_btn1.click()

#####################################
# Now at create post page
time.sleep(2)

song_field = browser.find_element_by_id('song')
rating_field = browser.find_element_by_id('rating')
comment_field = browser.find_element_by_id('comment')
url_field = browser.find_element_by_id('URL')
create_btn = browser.find_element_by_id('create_btn')

song_name = "test song name"
song_url = ""
rating_score = 5
rating_comment = "automated test script"
rating_field.send_keys(rating_score)
time.sleep(1)
for char in rating_comment:
	comment_field.send_keys(char)
	time.sleep(0.1)
# sleep 1 sec before submit
create_btn.click()


#
#
# def test_discover_search(search_term):
# 	browser = webdriver.Chrome()
# 	browser.get('localhost:3000')
#
#
#
# 	time.sleep(10)
#
# 	# search = browser.find_element_by_name('q')
# 	# search.send_keys(search_term)
#
# if __name__=="__main__":
# 	test_discover_search("Taylor")
time.sleep(200)
browser.quit()