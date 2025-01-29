<template>
    <div class="min-h-screen flex flex-col">
        <Header />

        <main v-if="!feedback" class="flex-grow flex items-center justify-center px-4">
            <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 class="text-xl font-semibold mb-4 text-center">Upload Your Resume</h2>
                <form @submit.prevent="submitForm">
                    <div class="mb-4">
                        <input type="text" id="name" v-model="name" required tabindex="1"
                            placeholder="Enter your full name"
                            class="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    </div>
                    <p class="mb-4 text-gray-600 text-center">Please upload your resume in PDF or DOCX format.</p>
                    <div class="flex items-center justify-center mb-4">
                        <label for="resume-upload"
                            class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>Choose File</span>
                        </label>
                        <input id="resume-upload" type="file" tabindex="2" @change="handleFileUpload"
                            accept=".pdf,.docx" class="opacity-0 absolute -z-10" required>
                    </div>
                    <p class="mt-2 text-sm text-gray-500 text-center">{{ fileName }}</p>
                    <p v-if="fileError" class="mt-1 text-xs text-red-500 text-center">{{ fileError }}</p>
                    <div class="mt-6 flex justify-center">
                        <button type="submit" tabindex="3" :disabled="!isValidFile"
                            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed">
                            Review Now
                        </button>
                    </div>
                </form>
            </div>
        </main>

        <div v-if="feedback" class="mt-8">
            <article class="prose lg:prose-xl">
                <vue-markdown :source="feedback" />
            </article>
        </div>
        <Footer />
    </div>
</template>

<script setup>
import VueMarkdown from "vue3-markdown-it";
import Header from './Header.vue'
import Footer from './Footer.vue'
import { ref, computed } from 'vue'

const name = ref('')
const file = ref(null)
const fileName = ref('No file chosen')
const fileError = ref('')
const feedback = ref('')

const isValidFile = computed(() => {
    return file.value && ['pdf', 'docx'].includes(file.value.name.split('.').pop().toLowerCase())
})

function handleFileUpload(event) {
    const uploadedFile = event.target.files[0]
    if (uploadedFile) {
        file.value = uploadedFile
        fileName.value = uploadedFile.name
        const fileExtension = uploadedFile.name.split('.').pop().toLowerCase()
        if (!['pdf', 'docx'].includes(fileExtension)) {
            fileError.value = 'Please upload a PDF or DOCX file.'
        } else {
            fileError.value = ''
        }
    } else {
        file.value = null
        fileName.value = 'No file chosen'
        fileError.value = ''
    }
}

async function submitForm() {
    if (!isValidFile.value) {
        fileError.value = 'Please select a valid file to upload.'
        return
    }

    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('resume', file.value)

    try {
        const response = await fetch('http://localhost:3000/review', {
            method: 'POST',
            body: formData
        })
        const data = await response.json()
        feedback.value = data.result
        //   alert('Resume submitted successfully! Response: ' + JSON.stringify(data))
        // Here you can handle the response from the server
    } catch (error) {
        console.error('Error:', error)
        alert('An error occurred while submitting the resume.')
    }
}
</script>