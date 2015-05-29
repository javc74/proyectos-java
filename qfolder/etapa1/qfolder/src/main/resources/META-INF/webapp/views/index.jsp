<%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@page session="false"%>
<html>
	<head>
		<title>Index</title>
		
		<script	type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
		<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
		
		<link type="text/css" rel="stylesheet" href="/css/index.css">
		<script type="text/javascript" src="/js/index.js"></script>
		
		<style>
			#holder { border: 10px dashed #ccc; width: 300px; height: 300px; margin: 20px auto;}
			#holder.hover { border: 10px dashed #333; }
		</style>
		
	</head>
	
	<body onload="reloadPage()">
		<div id="elements"></div>
		<hr><br>
		<form id="formulario" name="formulario" action="/host/add" method="post" enctype="application/x-www-form-urlencoded" onsubmit="return refresh()">
			<input name="host" type="text" placeholder="Ej. http://domain.local:9090" style="width: 300px" required pattern="https?://.+" />
			<input type="submit" value="Agregar"/>
		</form>
	</body>
</html>