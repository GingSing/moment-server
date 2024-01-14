# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory to /
WORKDIR .

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN yarn install

# Copy the current directory contents into the container at /
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run the server when the container launches
CMD ["node", "."]