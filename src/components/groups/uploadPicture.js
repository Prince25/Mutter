import React, { Component } from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import { updateImage } from '../../store/actions/groupActions'


export class UploadPicture extends Component {

  constructor(groupId) {
    super()
    this.groupId = groupId.groupId
  }

  state = {
    image: '',
    isUploading: false,
    progress: 0,
    imageURL: ''
  };

  handleUploadStart = () => this.setState({isUploading: true, progress: 0});
  handleProgress = (progress) => this.setState({progress});
  handleUploadError = (error) => {
    this.setState({isUploading: false});
    console.error(error);
  }
  handleUploadSuccess = (filename) => {
    this.setState({image: filename, progress: 100, isUploading: false});
    firebase.storage().ref('groups').child(filename).getDownloadURL().then(url => {
      this.setState({imageURL: url})
      this.props.updateImage(this.groupId, url)
    });
  }

    
  render() {

    return (
      <div>
        <form>
          <label>Upload Group Picture</label><br />
          {this.state.isUploading && <p>Progress: {this.state.progress}</p> }
          {this.state.imageURL && <p>Uploaded!</p> }
          
          <FileUploader
            accept="image/*"
            name="image"
            filename={ this.groupId }
            storageRef={firebase.storage().ref('groups')}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
            />
        </form>
        </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    updateImage: (groupId, imageUrl) => dispatch(updateImage(groupId, imageUrl))
  }
}


export default connect(null, mapDispatchToProps)(UploadPicture)
