<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import Prism from 'prismjs';

  export default defineComponent({

    props : {
        content: {
            type: Object,
        }
    },

    directives: {
        prism: {
            mounted() {
                if (typeof window !== 'undefined') {
                    Prism.highlightAll();
                }
            }
        },
    },

    setup(props){

        type TProps = {
                text: string,
                type:string
            }

        const loadHighLight = () => {
            setTimeout(()=> {
                if (typeof window !== 'undefined') {
                    const code = document.querySelector('code') as Element;
                    Prism.highlightElement(code);
                }
            }, 50)
        }

        const content = computed(():TProps =>{
            loadHighLight()
                
            return {
                text: props.content?.text,
                type: props.content?.type
            }
        })

        return {
            content
        }
    }
})

</script>
<style scoped>
  .fundo-black{
    background: rgb(16, 16, 20);
  }
  .w-card-input{
    width: 600px;
    height: 100%;
  }
</style>
<template>
    <n-space vertical>
        <div>
            <pre><code id="code" :class="`language-${content.type}`">
            {{ content.text || 'Ex:  select yousql from here;' }}
            </code></pre>
        </div>
    </n-space>
</template>