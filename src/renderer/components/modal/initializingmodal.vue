<template>
  <div class="cssload-battery">
    <div class="cssload-liquid"></div>
  </div>
</template>

<script>
  export default {
    name: 'initializingmodal'
  }
</script>

<style scoped>

.cssload-battery {
  display: block;
  margin:100px auto;
  position: relative;
  width: 12.25rem;
  height: 24.5rem;
  box-shadow: 0 0 0 1.2rem rgb(66,92,119);
    -o-box-shadow: 0 0 0 1.2rem rgb(66,92,119);
    -ms-box-shadow: 0 0 0 1.2rem rgb(66,92,119);
    -webkit-box-shadow: 0 0 0 1.2rem rgb(66,92,119);
    -moz-box-shadow: 0 0 0 1.2rem rgb(66,92,119);
  border-radius: 0.09rem;
    -o-border-radius: 0.09rem;
    -ms-border-radius: 0.09rem;
    -webkit-border-radius: 0.09rem;
    -moz-border-radius: 0.09rem;
  background: white;
}
.cssload-battery:before {
  content: '';
  position: absolute;
  left: 3.5625rem;
  right: 3.5625rem;
  top: -2.3375rem;
  height: 2.3375rem;
  width: 6.125rem;
  background: rgb(66,92,119);
  border-radius: 1.18rem;
    -o-border-radius: 1.18rem;
    -ms-border-radius: 1.18rem;
    -webkit-border-radius: 1.18rem;
    -moz-border-radius: 1.18rem;
}
.cssload-battery:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-right: 12.25rem solid transparent;
  border-bottom: 22.05rem solid rgba(255,255,255,0.32);
}

.cssload-liquid {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 12.25rem;
  background: rgb(113,251,133);
  animation: load 2.59s infinite;
    -o-animation: load 2.59s infinite;
    -ms-animation: load 2.59s infinite;
    -webkit-animation: load 2.59s infinite;
    -moz-animation: load 2.59s infinite;
}
.cssload-liquid:after, .cssload-liquid:before {
  content: '';
  position: absolute;
  top: -2.5rem;
  height: 6.125rem;
  width: 8.4625rem;
  background: rgb(113,251,133);
  opacity: 0;
  border-radius: 50%;
    -o-border-radius: 50%;
    -ms-border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
}
.cssload-liquid:after {
  right: 0;
  animation: cssload-liquid-1 2.59s infinite;
    -o-animation: cssload-liquid-1 2.59s infinite;
    -ms-animation: cssload-liquid-1 2.59s infinite;
    -webkit-animation: cssload-liquid-1 2.59s infinite;
    -moz-animation: cssload-liquid-1 2.59s infinite;
}
.cssload-liquid:before {
  left: 0;
  animation: cssload-liquid-2 2.59s infinite;
    -o-animation: cssload-liquid-2 2.59s infinite;
    -ms-animation: cssload-liquid-2 2.59s infinite;
    -webkit-animation: cssload-liquid-2 2.59s infinite;
    -moz-animation: cssload-liquid-2 2.59s infinite;
}

@keyframes load {
  0% {
    top: 24.5rem;
  }
  70% {
    top: 6.125rem;
  }
  90% {
    top: 0;
  }
  95% {
    top: 0;
  }
  100% {
    top: 24.5rem;
  }
}

@-o-keyframes load {
  0% {
    top: 24.5rem;
  }
  70% {
    top: 6.125rem;
  }
  90% {
    top: 0;
  }
  95% {
    top: 0;
  }
  100% {
    top: 24.5rem;
  }
}

@-ms-keyframes load {
  0% {
    top: 24.5rem;
  }
  70% {
    top: 6.125rem;
  }
  90% {
    top: 0;
  }
  95% {
    top: 0;
  }
  100% {
    top: 24.5rem;
  }
}

@-webkit-keyframes load {
  0% {
    top: 24.5rem;
  }
  70% {
    top: 6.125rem;
  }
  90% {
    top: 0;
  }
  95% {
    top: 0;
  }
  100% {
    top: 24.5rem;
  }
}

@-moz-keyframes load {
  0% {
    top: 24.5rem;
  }
  70% {
    top: 6.125rem;
  }
  90% {
    top: 0;
  }
  95% {
    top: 0;
  }
  100% {
    top: 24.5rem;
  }
}

@keyframes cssload-liquid-1 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  22% {
    height: 1.28125rem;
    top: 2.375rem;
    opacity: 1;
  }
  25% {
    top: -1.25rem;
  }
  35% {
    height: 6.125rem;
    top: -2.5rem;
  }
  55% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 3.61875rem;
    opacity: 1;
    top: -1.275rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@-o-keyframes cssload-liquid-1 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  22% {
    height: 1.28125rem;
    top: 2.375rem;
    opacity: 1;
  }
  25% {
    top: -1.25rem;
  }
  35% {
    height: 6.125rem;
    top: -2.5rem;
  }
  55% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 3.61875rem;
    opacity: 1;
    top: -1.275rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@-ms-keyframes cssload-liquid-1 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  22% {
    height: 1.28125rem;
    top: 2.375rem;
    opacity: 1;
  }
  25% {
    top: -1.25rem;
  }
  35% {
    height: 6.125rem;
    top: -2.5rem;
  }
  55% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 3.61875rem;
    opacity: 1;
    top: -1.275rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@-webkit-keyframes cssload-liquid-1 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  22% {
    height: 1.28125rem;
    top: 2.375rem;
    opacity: 1;
  }
  25% {
    top: -1.25rem;
  }
  35% {
    height: 6.125rem;
    top: -2.5rem;
  }
  55% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 3.61875rem;
    opacity: 1;
    top: -1.275rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@-moz-keyframes cssload-liquid-1 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  22% {
    height: 1.28125rem;
    top: 2.375rem;
    opacity: 1;
  }
  25% {
    top: -1.25rem;
  }
  35% {
    height: 6.125rem;
    top: -2.5rem;
  }
  55% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 3.61875rem;
    opacity: 1;
    top: -1.275rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@keyframes cssload-liquid-2 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  17.5% {
    height: 1.28125rem;
    top: 1.2rem;
    opacity: 1;
  }
  20% {
    top: -1.25rem;
  }
  25% {
    height: 7.40625rem;
    top: -3.625rem;
  }
  45% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 7.40625rem;
    opacity: 1;
    top: -2.5rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@-o-keyframes cssload-liquid-2 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  17.5% {
    height: 1.28125rem;
    top: 1.2rem;
    opacity: 1;
  }
  20% {
    top: -1.25rem;
  }
  25% {
    height: 7.40625rem;
    top: -3.625rem;
  }
  45% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 7.40625rem;
    opacity: 1;
    top: -2.5rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@-ms-keyframes cssload-liquid-2 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  17.5% {
    height: 1.28125rem;
    top: 1.2rem;
    opacity: 1;
  }
  20% {
    top: -1.25rem;
  }
  25% {
    height: 7.40625rem;
    top: -3.625rem;
  }
  45% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 7.40625rem;
    opacity: 1;
    top: -2.5rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@-webkit-keyframes cssload-liquid-2 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  17.5% {
    height: 1.28125rem;
    top: 1.2rem;
    opacity: 1;
  }
  20% {
    top: -1.25rem;
  }
  25% {
    height: 7.40625rem;
    top: -3.625rem;
  }
  45% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 7.40625rem;
    opacity: 1;
    top: -2.5rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}

@-moz-keyframes cssload-liquid-2 {
  0% {
    height: 0;
    opacity: 0;
    top: -2.5rem;
  }
  17.5% {
    height: 1.28125rem;
    top: 1.2rem;
    opacity: 1;
  }
  20% {
    top: -1.25rem;
  }
  25% {
    height: 7.40625rem;
    top: -3.625rem;
  }
  45% {
    height: 1.28125rem;
    top: -1.125rem;
  }
  60% {
    height: 7.40625rem;
    opacity: 1;
    top: -2.5rem;
  }
  96% {
    height: 4.84375rem;
    opacity: 0;
    top: 2.5rem;
  }
  100% {
    height: 0;
    opacity: 0;
  }
}
</style>
