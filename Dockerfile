# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /src
# Expose port for the Node.js server
EXPOSE 3000
# Copy the application files into the working directory
COPY . /src
# Install the application dependencies using Yarn
RUN npm i

# Define the entry point for the container
CMD ["npm", "start"]
