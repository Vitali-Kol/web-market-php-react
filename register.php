<?php
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    echo json_encode(["status" => "ok"]);
    exit();
}

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'register_form_market';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
    exit();
}

$username = trim($input["username"] ?? "");
$email = trim($input["email"] ?? "");
$password = trim($input["password"] ?? "");

if (!$username || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit();
}

$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["status" => "error", "message" => "Email already registered"]);
    $check->close();
    $conn->close();
    exit();
}
$check->close();

$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $password);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Registration failed"]);
}

$stmt->close();
$conn->close();