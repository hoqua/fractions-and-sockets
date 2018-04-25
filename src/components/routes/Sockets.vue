<template>
  <div class="flex-container">
    <slot></slot>
    <div v-if="isError" class="error-box">
      <div @click="isError = false" class="error-close-button"></div>
      <p class="error-text">WS ERROR</p>
    </div>
    <div class="comment-section-wrapper">
      <transition-group name="slide">
        <div v-for="(comment, index) in commentsList" class="comment-wrapper" :key="comment.id">
          <div class="comment-name">{{comment.userName}}</div>
          <div class="comment-text">{{comment.text}}</div>
          <div @click="dispatchDeleteAction(index)" class="comment-close-button"></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  import {COMMENTARY_DELETE} from '../../actionTypes'

  export default {
    name: "sockets",
    data() {
      return {
        isError: false,
        timeout: 3000,
        wsUri: "ws://echo.websocket.org/",
        commentsList: [
          {
            id: '1',
            userName: 'Name 1',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '2',
            userName: 'Name 2',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '3',
            userName: 'Name 3',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '4',
            userName: 'Name 4',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '5',
            userName: 'Name 5',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '6',
            userName: 'Name 6',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '7',
            userName: 'Name 7',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '8',
            userName: 'Name 8',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '9',
            userName: 'Name 9',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          },
          {
            id: '10',
            userName: 'Name 10',
            text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          }
        ],
        taskQueue: [],
      }
    },
    methods: {
      dispatchDeleteAction(index) {
        const call = {isActionsNeeded: true, actionName: COMMENTARY_DELETE, index: index}
        this.websocket.send(JSON.stringify(call))
        this.taskQueue.push(call)
        setTimeout(() => this.verifyActionDone(index), this.timeout)
      },
      [COMMENTARY_DELETE](index) {
        this.commentsList.splice(index, 1)
        const foundedTask = this.searchInTaskQueue(index)
        foundedTask === -1 ? this.isError = true : this.taskQueue.splice(foundedTask, 1)
      },
      onMessage(evt) {
        const response = JSON.parse(evt.data)
        if (response.isActionsNeeded) {
          this[response.actionName](response.index)
        }
      },
      verifyActionDone(index) {
        this.searchInTaskQueue(index) === -1 ? null : this.isError = true
      },
      searchInTaskQueue(index) {
        return this.taskQueue.findIndex(el => el.index === index)
      },
      onOpen(evt) {
        console.log(evt)
      },
      onClose(evt) {
        console.log(evt)
      },
      onError(evt) {
        console.log(evt)
      }
    },
    created() {
      this.websocket = new WebSocket(this.wsUri);
      this.websocket.onopen = (evt) => {
        this.onOpen(evt)
      }
      this.websocket.onclose = (evt) => {
        this.onClose(evt)
      }
      this.websocket.onmessage = (evt) => {
        this.onMessage(evt)
      }
      this.websocket.onerror = (evt) => {
        this.onError(evt)
      }
    },
    destroyed() {
      delete this.websocket.onopen
      delete this.websocket.onclose
      delete this.websocket.onmessage
      delete this.websocket.onerror
    }
  }
</script>

<style scoped>
  .error-box {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 150px;
  }

  .error-text {
    position: absolute;
    margin: 0;
    right: 20px;
    top: 5px;
  }

  .error-close-button {
    height: 20px;
    width: 20px;
  }

  .error-close-button:hover {
    cursor: pointer;
  }

  .comment-section-wrapper {
    height: 100%;
    position: relative;
  }

  .comment-wrapper {
    position: relative;
    width: 300px;
    height: 100px;
    background: beige;
    margin-bottom: 20px;
  }

  .comment-name {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .comment-text {
    padding: 30px;
  }

  .comment-close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    height: 20px;
    width: 20px;
  }

  .comment-close-button::after, .error-close-button::after {
    content: "\2716";
    text-indent: 0;
    display: block;
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 12px;
  }

  .comment-close-button:hover {
    cursor: pointer;
  }

  .slide-leave-active,
  .slide-enter-active {
    position: relative;
    transition: 1s;
  }

  .slide-enter {
    transform: translate(100%, 0);
  }

  .slide-leave-to {
    transform: translate(-100%, 0);
  }
</style>

